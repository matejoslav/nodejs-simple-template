import { IocContainer } from "@tsoa/runtime";
import { container } from "./container";

export const iocContainer: IocContainer = {
  get: <T>(controller: { prototype: T }): T => {
    return container.resolve<T>(controller as never);
  },
} as IocContainer;
