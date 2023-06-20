import type { NextApiRequest, NextApiResponse } from 'next';
import { roqClient } from 'server/roq';
import { prisma } from 'server/db';
import { errorHandlerMiddleware } from 'server/middlewares';
import { lenderValidationSchema } from 'validationSchema/lenders';
import { HttpMethod, convertMethodToOperation, convertQueryToPrismaUtil } from 'server/utils';
import { getServerSession } from '@roq/nextjs';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { roqUserId, user } = await getServerSession(req);
  await prisma.lender
    .withAuthorization({
      roqUserId,
      tenantId: user.tenantId,
      roles: user.roles,
    })
    .hasAccess(req.query.id as string, convertMethodToOperation(req.method as HttpMethod));

  switch (req.method) {
    case 'GET':
      return getLenderById();
    case 'PUT':
      return updateLenderById();
    case 'DELETE':
      return deleteLenderById();
    default:
      return res.status(405).json({ message: `Method ${req.method} not allowed` });
  }

  async function getLenderById() {
    const data = await prisma.lender.findFirst(convertQueryToPrismaUtil(req.query, 'lender'));
    return res.status(200).json(data);
  }

  async function updateLenderById() {
    await lenderValidationSchema.validate(req.body);
    const data = await prisma.lender.update({
      where: { id: req.query.id as string },
      data: {
        ...req.body,
      },
    });
    if (req.body.name) {
      await roqClient.asUser(roqUserId).updateTenant({ id: user.tenantId, tenant: { name: req.body.name } });
    }
    return res.status(200).json(data);
  }
  async function deleteLenderById() {
    const data = await prisma.lender.delete({
      where: { id: req.query.id as string },
    });
    return res.status(200).json(data);
  }
}

export default function apiHandler(req: NextApiRequest, res: NextApiResponse) {
  return errorHandlerMiddleware(handler)(req, res);
}
