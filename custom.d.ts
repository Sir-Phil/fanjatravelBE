import { ICategory } from "./src/interface/category";
import { ITour } from "./src/models/tour";

declare global {
    namespace Express {
     export interface Request {
        category: ICategory,
        tour: ITour,
        
      }
    }
  }
