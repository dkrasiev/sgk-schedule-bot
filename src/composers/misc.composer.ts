import { Composer } from "grammy";
import { groupService } from "../services/group.service";
import { MyContext } from "../interfaces/context.interface";
import { teacherService } from "../services/teacher.service";
import { getArgument } from "../helpers/get-argument";

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
    await ctx.reply("Для поиска необходимо ввести запрос");

    return;
  }

  const teachers = await teacherService.getAll();

  const findedTeachers = teachers.filter((teacher) =>
    teacher.name.toLowerCase().includes(argument)
  );

  if (findedTeachers.length === 0) {
    await ctx.reply("По введенному запросы преподаватели не найдены");

    return;
  }

  await ctx.reply(
    "Найденные преподаватели:\n" +
      findedTeachers.map((teacher) => teacher.name).join("\n")
  );
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

  await ctx.reply("По указанному запросу ничего не найдено");
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
