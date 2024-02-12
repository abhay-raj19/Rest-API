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

// async function main() {
//     const newUser = await prisma.user.create({
//         data:{
//             name:"jhon",
//             email:"kirat@prisma.io",
//             posts:{
//                 create : {
//                     title:"Hello world ",
//                 },
//             }
//         }
//     });
//     console.log("created up a new user: ",newUser);
//     const allUsers = await prisma.user.findMany({
//         include:{
//             posts:true
//         },
//     })
//     console.log("All the users: ");
//     console.dir(allUsers)

// }

// main()
// .catch((e) => console.error(e))
// .finally(async () => await prisma.$disconnect())

app.listen(3000, () =>
  console.log("REST API server ready at: http://localhost:3000")
);
