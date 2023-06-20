import type { NextApiRequest, NextApiResponse } from 'next';
import { roqClient } from 'server/roq';
import { prisma } from 'server/db';
import { errorHandlerMiddleware } from 'server/middlewares';
import { loanValidationSchema } from 'validationSchema/loans';
import { HttpMethod, convertMethodToOperation, convertQueryToPrismaUtil } from 'server/utils';
import { getServerSession } from '@roq/nextjs';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { roqUserId, user } = await getServerSession(req);
  await prisma.loan
    .withAuthorization({
      roqUserId,
      tenantId: user.tenantId,
      roles: user.roles,
    })
    .hasAccess(req.query.id as string, convertMethodToOperation(req.method as HttpMethod));

  switch (req.method) {
    case 'GET':
      return getLoanById();
    case 'PUT':
      return updateLoanById();
    case 'DELETE':
      return deleteLoanById();
    default:
      return res.status(405).json({ message: `Method ${req.method} not allowed` });
  }

  async function getLoanById() {
    const data = await prisma.loan.findFirst(convertQueryToPrismaUtil(req.query, 'loan'));
    return res.status(200).json(data);
  }

  async function updateLoanById() {
    await loanValidationSchema.validate(req.body);
    const data = await prisma.loan.update({
      where: { id: req.query.id as string },
      data: {
        ...req.body,
      },
    });

    return res.status(200).json(data);
  }
  async function deleteLoanById() {
    const data = await prisma.loan.delete({
      where: { id: req.query.id as string },
    });
    return res.status(200).json(data);
  }
}

export default function apiHandler(req: NextApiRequest, res: NextApiResponse) {
  return errorHandlerMiddleware(handler)(req, res);
}
