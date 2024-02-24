import { createRouteHandler } from "uploadthing/next";
 
import { ourFileRouter } from "./core";
import { UTApi } from "uploadthing/server";
 
// Export routes for Next App Router
export const { GET, POST } = createRouteHandler({
  router: ourFileRouter,
});

export async function DELETE(request: Request) {
  const data = await request.json();
  const newUrl = data.url.substring(data.url.lastIndexOf("/") + 1);
  const utapi = new UTApi(); //--- i used this inside route file in uploadthing folder
  await utapi.deleteFiles(newUrl);

  return Response.json({ success: "file deleted successfully" });
}