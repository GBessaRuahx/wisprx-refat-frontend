import * as Yup from "yup";

import AppError from "../../errors/AppError";
import ShowUserService from "./ShowUserService";
import Company from "../../models/Company";
import User from "../../models/User";

interface UserData {
  email?: string;
  password?: string;
  name?: string;
  profile?: string;
  companyId?: number;
  queueIds?: number[];
  whatsappId?: number;
  allTicket?: string;
  super?: boolean;
  owner?: boolean;
}

interface Request {
  userData: UserData;
  userId: string | number;
  companyId: number;
  requestUserId: number;
}

interface Response {
  id: number;
  name: string;
  email: string;
  profile: string;
}

const UpdateUserService = async ({
  userData,
  userId,
  companyId,
  requestUserId
}: Request): Promise<Response | undefined> => {
  const user = await ShowUserService(userId);

  const requestUser = await User.findByPk(requestUserId);

  const {
    email,
    password,
    profile,
    name,
    queueIds = [],
    whatsappId,
    allTicket
  } = userData;

  let { super: isSuper, owner } = userData;

  if ((isSuper !== undefined || owner !== undefined) && !requestUser.super) {
    throw new AppError("ERR_NO_SUPER", 403);
  }

  if (owner === true && !(requestUser.super || requestUser.owner)) {
    throw new AppError("ERR_NO_PERMISSION", 403);
  }

  if (requestUser.super === false && userData.companyId !== companyId) {
    throw new AppError("O usuário não pertence à esta empresa");
  }

  const schema = Yup.object().shape({
    name: Yup.string().min(2),
    email: Yup.string().email(),
    profile: Yup.string(),
    password: Yup.string(),
    allTicket: Yup.string(),
    super: Yup.boolean(),
    owner: Yup.boolean()
  });

  try {
    await schema.validate({ email, password, profile, name, allTicket, super: isSuper, owner });
  } catch (err: any) {
    throw new AppError(err.message);
  }

  if (user.owner && isSuper === false) {
    throw new AppError("ERR_OWNER_MUST_BE_SUPER", 400);
  }

  if (owner) {
    const previousOwner = await User.findOne({ where: { owner: true, companyId } });
    if (previousOwner && previousOwner.id !== user.id) {
      await previousOwner.update({ owner: false });
    }
    isSuper = true;
  }

  await user.update({
    email,
    password,
    profile,
    name,
    whatsappId: whatsappId || null,
    allTicket,
    super: isSuper !== undefined ? isSuper : user.super,
    owner: owner !== undefined ? owner : user.owner
  });

  await user.$set("queues", queueIds);

  await user.reload();

  const company = await Company.findByPk(user.companyId);

  const serializedUser = {
    id: user.id,
    name: user.name,
    email: user.email,
    profile: user.profile,
    owner: user.owner,
    companyId: user.companyId,
    company,
    queues: user.queues
  };

  return serializedUser;
};

export default UpdateUserService;
