import type { NextApiRequest, NextApiResponse } from 'next';
import { roqClient } from 'server/roq';
import { prisma } from 'server/db';
import { authorizationValidationMiddleware, errorHandlerMiddleware } from 'server/middlewares';
import { personValidationSchema } from 'validationSchema/people';
import { convertQueryToPrismaUtil } from 'server/utils';
import { getServerSession } from '@roq/nextjs';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { roqUserId, user } = await getServerSession(req);
  switch (req.method) {
    case 'GET':
      return getPeople();
    case 'POST':
      return createPerson();
    default:
      return res.status(405).json({ message: `Method ${req.method} not allowed` });
  }

  async function getPeople() {
    const data = await prisma.person
      .withAuthorization({
        roqUserId,
        tenantId: user.tenantId,
        roles: user.roles,
      })
      .findMany(convertQueryToPrismaUtil(req.query, 'person'));
    return res.status(200).json(data);
  }

  async function createPerson() {
    await personValidationSchema.validate(req.body);
    const body = { ...req.body };
    if (body?.expense?.length > 0) {
      const create_expense = body.expense;
      body.expense = {
        create: create_expense,
      };
    } else {
      delete body.expense;
    }
    const data = await prisma.person.create({
      data: body,
    });
    return res.status(200).json(data);
  }
}

export default function apiHandler(req: NextApiRequest, res: NextApiResponse) {
  return errorHandlerMiddleware(authorizationValidationMiddleware(handler))(req, res);
}
