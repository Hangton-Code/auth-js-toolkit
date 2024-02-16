import { db } from "@/lib/db";
import { minioClient } from "@/lib/minio";
import { NewProfileSchema } from "@/schemas";
import { protectedProcedure } from "@/server/middlewares";
import { v4 as uuidv4 } from "uuid";

export const newProfileProcedure = protectedProcedure
  .input(NewProfileSchema)
  .mutation(async (opts) => {
    const session = opts.ctx.session;
    const { name, newPicture } = opts.input;

    if (name !== session.user.name) {
      await db.user.update({
        where: { id: session.user.id },
        data: {
          name,
        },
      });
    }

    // 0: No change for avatar
    // 1: Upload new avatar
    if (newPicture === 1) {
      const policy = minioClient.newPostPolicy();

      policy.setBucket("auth");

      // generate name by uuid
      const fileName = uuidv4();
      policy.setKey("avatars/" + fileName);

      // expires in 15 mins
      const expires = new Date(new Date().getTime() + 15 * 60 * 1000);
      policy.setExpires(expires);

      // set min 1B max 1MB
      policy.setContentLengthRange(1, 1024 * 1024);

      policy.setContentType("image/*");

      const presignedPost = await minioClient.presignedPostPolicy(policy);

      // update in database
      await db.user.update({
        where: { id: session.user.id },
        data: {
          image:
            (process.env.MINIO_APP_URL as string) + "/auth/avatars/" + fileName,
        },
      });

      return {
        presignedPost: presignedPost,
        success: "Done!",
      };
    }
    // 2: Remove current avatar
    if (newPicture === 2) {
      // update in database
      await db.user.update({
        where: { id: session.user.id },
        data: {
          image: null,
        },
      });
    }

    // delete old picture
    if (session.user.image && (newPicture === 1 || newPicture === 2)) {
      if (session.user.image.startsWith(process.env.MINIO_APP_URL as string)) {
        const paths = session.user.image.split("/");
        const fileName = paths[paths.length - 1];
        await minioClient.removeObject("auth", "avatars/" + fileName);
      }
    }

    return { presignedPost: null, success: "Profile Updated!" };
  });