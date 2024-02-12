import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()
import  express  from 'express';

const app = express()
app.use(express.json())


app.get('/users', async (req, res) => {
    const users = await prisma.user.findMany()
    res.json(users)
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
  console.log('REST API server ready at: http://localhost:3000'),
)