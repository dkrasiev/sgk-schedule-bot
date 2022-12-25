import { Composer } from "grammy";

import { groupService } from "../services/group.service";
import { MyContext } from "../models/my-context.type";
import { teacherService } from "../services/teacher.service";
import { getArgument } from "../helpers/get-argument";
import { cabinetsService } from "../services/cabinet.service";
import { Cabinet } from "../models/cabinet.interface";
import { Group } from "../models/group.interface";
import { Teacher } from "../models/teacher.interface";

const miscComposer = new Composer<MyContext>();

miscComposer.command("groups", async (ctx) => {
  const argument: string = getArgument(ctx.msg.text);

  const groups: Group[] = await groupService.findMany(argument);

  if (groups.length === 0) {
    await ctx.reply(ctx.t("groups_not_found"));
    return;
  }

  const groupsList: string = groups.map(({ name }) => name).join("\n");

  await ctx.reply(ctx.t("groups_found", { groups: groupsList }));
});

miscComposer.command("teacher", async (ctx) => {
  const argument: string = getArgument(ctx.msg.text);

  if (!argument) {
    await ctx.reply(ctx.t("teacher_fail"), { parse_mode: "HTML" });
    return;
  }

  const teachers: Teacher[] = await teacherService.findMany(argument);

  if (teachers.length === 0) {
    await ctx.reply(ctx.t("teacher_not_found"));
    return;
  }

  const teachersList: string = teachers.map(({ name }) => name).join("\n");

  await ctx
    .reply(ctx.t("teacher_found", { teachers: teachersList }))
    .catch((e) => {
      if (e?.description?.includes("message is too long")) {
        ctx.reply(ctx.t("teacher_too_many"));
      }
    });

  // const argument = getArgument(ctx.msg.text);

  // if (!argument) {
  //   await ctx.reply(ctx.t("teacher_fail"), { parse_mode: "HTML" });

  //   return;
  // }

  // const teachers = await teacherService.getAll();

  // const findedTeachers = teachers.filter((teacher) =>
  //   teacher.name.toLowerCase().includes(argument)
  // );

  // if (findedTeachers.length === 0) {
  //   await ctx.reply(ctx.t("teacher_not_found"));

  //   return;
  // }

  // await ctx
  //   .reply(
  //     ctx.t("teacher_found", {
  //       teachers: findedTeachers.map((teacher) => teacher.name).join("\n"),
  //     })
  //   )
  //   .catch((e) => {
  //     if (
  //       e.description &&
  //       typeof e.description === "string" &&
  //       e.description.includes("message is too long")
  //     ) {
  //       ctx.reply(ctx.t("teacher_too_many"));
  //     }
  //   });
});

miscComposer.command("cabinet", async (ctx) => {
  const argument: string = getArgument(ctx.msg.text);

  const cabinets: Cabinet[] = await cabinetsService.findMany(argument);

  if (cabinets.length === 0) {
    await ctx.reply(ctx.t("cabinet_not_found"));
    return;
  }

  const cabinetList: string = cabinets
    .map((cabinet) => cabinet.name)
    .join("\n");
  await ctx.reply(ctx.t("cabinet_found", { cabinets: cabinetList }));
});

miscComposer.command("setdefault", async (ctx) => {
  const argument = getArgument(ctx.message?.text ?? "");

  if (!argument) {
    await ctx.reply(ctx.t("set_default_fail"), { parse_mode: "HTML" });

    return;
  }

  const group = await groupService.findInText(argument);
  if (group) {
    ctx.session.defaultGroup = group.id;
    await ctx.reply(ctx.t("set_default_success", { name: group.name }));

    return;
  }

  const teacher = await teacherService.findInText(argument);
  if (teacher) {
    ctx.session.defaultGroup = Number(teacher.id);
    await ctx.reply(ctx.t("set_default_success", { name: teacher.name }));

    return;
  }

  await ctx.reply(ctx.t("set_default_not_found"));
});

miscComposer.command("removedefault", async (ctx) => {
  if (ctx.session.defaultGroup) {
    ctx.session.defaultGroup = 0;
    await ctx.reply(ctx.t("remove_group_success"));
    return;
  }

  await ctx.reply(ctx.t("remove_group_fail"));
});

export default miscComposer;
