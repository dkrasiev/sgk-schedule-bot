import { Composer } from "grammy";
import { groupService } from "../services/group.service";
import { MyContext } from "../models/my-context.type";
import { teacherService } from "../services/teacher.service";
import { getArgument } from "../helpers/get-argument";
import { cabinetsService } from "../services/cabinet.service";
import { Cabinet } from "../models/cabinet.interface";

const miscComposer = new Composer<MyContext>();

miscComposer.command("groups", async (ctx) => {
  const groups = await groupService.getAll();

  const groupsNameArray = groups
    .filter((group) => group.name.length > 2)
    .map((group) => group.name)
    .sort((a, b) => a.localeCompare(b));

  await ctx.reply(groupsNameArray.join("\n"));
});

miscComposer.command("teacher", async (ctx) => {
  const argument =
    ctx.message?.text && getArgument(ctx.message.text).toLowerCase();
  if (!argument) {
    await ctx.reply(ctx.t("teacher_fail"), { parse_mode: "HTML" });

    return;
  }

  const teachers = await teacherService.getAll();

  const findedTeachers = teachers.filter((teacher) =>
    teacher.name.toLowerCase().includes(argument)
  );

  if (findedTeachers.length === 0) {
    await ctx.reply(ctx.t("teacher_not_found"));

    return;
  }

  await ctx
    .reply(
      ctx.t("teacher_found", {
        teachers: findedTeachers.map((teacher) => teacher.name).join("\n"),
      })
    )
    .catch((e) => {
      if (
        e.description &&
        typeof e.description === "string" &&
        e.description.includes("message is too long")
      ) {
        ctx.reply(ctx.t("teacher_too_many"));
      }
    });
});

miscComposer.command("cabinet", async (ctx) => {
  const argument: string = ctx.msg.text.split(" ")[1];

  if (!argument) {
    await ctx.reply(ctx.t("cabinet_fail"), { parse_mode: "HTML" });
    return;
  }

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
