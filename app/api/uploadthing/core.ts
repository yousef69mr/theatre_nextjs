import { currentUser } from "@/lib/auth";
import { createUploadthing, type FileRouter } from "uploadthing/next";

const f = createUploadthing();

const handleAuth = async () => {
  const user = await currentUser();
  if (!user?.id) {
    throw new Error("Unauthorized");
  }
  return { userId: user.id };
};
// FileRouter for your app, can contain multiple FileRoutes
export const ourFileRouter = {
  playImage: f({ image: { maxFileSize: "8MB", maxFileCount: 1 } })
    .middleware(() => handleAuth())
    .onUploadComplete((data) => {
      console.log("play image", data);
    }),
  playImagesGallery: f({ image: { maxFileSize: "8MB" } })
    .middleware(() => handleAuth())
    .onUploadComplete((data) => {
      console.log("play gallery", data);
    }),
  executorImage: f({ image: { maxFileSize: "16MB", maxFileCount: 1 } })
    .middleware(() => handleAuth())
    .onUploadComplete((data) => {
      console.log("executor image", data);
    }),
  festivalImage: f({ image: { maxFileSize: "8MB", maxFileCount: 1 } })
    .middleware(() => handleAuth())
    .onUploadComplete((data) => {
      console.log("executor image", data);
    }),
  actorImage: f({ image: { maxFileSize: "16MB", maxFileCount: 1 } })
    .middleware(() => handleAuth())
    .onUploadComplete((data) => {
      console.log("actor image", data);
    }),
  actorInPlayImage: f({ image: { maxFileSize: "16MB", maxFileCount: 1 } })
    .middleware(() => handleAuth())
    .onUploadComplete((data) => {
      console.log("actor in play image", data);
    }),
  userImage: f({ image: { maxFileSize: "8MB", maxFileCount: 1 } })
    .middleware(() => handleAuth())
    .onUploadComplete((data) => {
      console.log("profile image", data);
    }),
  messageFile: f(["image", "pdf"])
    .middleware(() => handleAuth())
    .onUploadComplete((data) => {
      console.log("file", data);
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
