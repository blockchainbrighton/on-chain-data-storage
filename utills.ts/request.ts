import { createProject } from "../controller/project.controller";
import { getRequestList } from "../controller/request.controller";
import { deployToken, initPool } from "../controller/token.controller";
import { RequestStatus, RequestTypes } from "../types";
import { getRequestStatus } from "./hiro";

export const handleRequest = async () => {
  try {
    const res = await getRequestList();
    if (res.success && res.requestList) {
      for (let req of res.requestList) {
        if (req.status == RequestStatus.UNCONFIRMED) {
          const status = await getRequestStatus(req.txId);
          req.status = status;
          await req.save();
        }
        if (req.status == RequestStatus.CONFIRMED) {
          if (req.type == RequestTypes.DEPOSIT) {
            const deployRes = await deployToken(req.tokenName, req.tokenSymbol);
            if (deployRes.success) {
              req.type = RequestTypes.DEPLOY;
              req.status = RequestStatus.UNCONFIRMED;
              req.txId = (deployRes.msg as any).txid;
              await req.save();
            }
          } else if (req.type == RequestTypes.DEPLOY) {
            const poolRes = await initPool(req.tokenName);
            console.log("Pool Res", req, poolRes);
            if (poolRes.success) {
              req.status = RequestStatus.DEPLOYED;
              await req.save();
              await createProject(
                req.tokenName,
                req.tokenSymbol,
                req.description,
                req.creator
              );
            }
          }
        }
      }
    } else {
      return;
    }
  } catch (error) {
    console.log("Handle Request Error =>", error);
  }
};
