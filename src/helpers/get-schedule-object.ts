import { Group, MyContext } from "../interfaces";
import { Teacher } from "../interfaces/teacher.interface";
import { groupService } from "../services/group.service";
import { teacherService } from "../services/teacher.service";
import { getArgument } from "./get-argument";

export async function getScheduleObject(
  ctx: MyContext
): Promise<Teacher | Group | undefined> {
  const argument = getArgument(ctx.message?.text ?? "");
  if (argument) {
    return (
      (await groupService.findInText(argument)) ||
      (await teacherService.findInText(argument))
    );
  }

  const id = ctx.session.defaultGroup;
  if (id) {
    return (
      (await groupService.findById(id)) ||
      (await teacherService.findById(id.toString()))
    );
  }

  return undefined;
}
