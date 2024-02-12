import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
import express from "express";

const app = express();
app.use(express.json());

app.get("/users", async (req, res) => {
  const users = await prisma.user.findMany();
  res.json(users);
});

app.get("/feed", async (req, res) => {
  const post = await prisma.post.findMany({
    where: { published: true },
    include: { author: true },
  });
  res.json(post);
});
app.get("/post/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const post = await prisma.post.findUnique({
      where: { id: Number(id) },
    });

    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }

    return res.json(post);
  } catch (error) {
    console.error("Error fetching post:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

app.post("/user", async (req, res) => {
  const newUser = await prisma.user.create({
    data: {
      ...req.body,
    },
  });
  res.json(newUser);
});

app.post("/post", async (req, res) => {
  const { title, content, authorEmail } = req.body;
  const newPost = await prisma.post.create({
    data: {
      title,
      content,
      published: false,
      author: { connect: { email: authorEmail } },
    },
  });
  res.json(newPost);
});

app.put("/post/publish/:id",async (req,res) => {
    const { id } = req.params;
    const post = await prisma.post.update({
        where:{id:Number(id)},
        data:{published:true},
    })
    res.json(post);
})

app.delete("/post/:id",async (req, res) => {
    const { id } = req.params;
    const post = await prisma.post.delete({
        where:{id:Number(id)},
    })
    res.json(post);
})



app.listen(3000, () =>
  console.log("REST API server ready at: http://localhost:3000")
);
