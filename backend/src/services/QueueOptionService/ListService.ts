import { WhereOptions } from "sequelize/types";
import QueueOption from "../../models/QueueOption";

type QueueOptionFilter = {
  queueId: string | number;
  queueOptionId: string | number;
  parentId: string | number | boolean;
};

const ListService = async ({ queueId, queueOptionId, parentId }: QueueOptionFilter): Promise<QueueOption[]> => {

  const whereOptions: WhereOptions = {};

  if (queueId) {
    whereOptions.queueId = queueId;
  }

  if (queueOptionId) {
    whereOptions.id = queueOptionId;
  }

  if (parentId == -1) {
    whereOptions.parentId = null;
  } else if (parentId && Number(parentId) > 0) {
    whereOptions.parentId = Number(parentId);
  }

  const queueOptions = await QueueOption.findAll({
    where: whereOptions,
    order: [["id", "ASC"]]
  });

  return queueOptions;
};

export default ListService;
