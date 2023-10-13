import * as express from "express";
import { v4 as uuidv4 } from "uuid";
import { PostgreDataSource } from "../database/data-source";
import { Client } from "../database/entitities/Client";

const app = express();
const port = 5000;

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// client crud
app.post("/api/client", async (req: express.Request, res: express.Response) => {
  const { firstName, lastName, email, cardNumber, balance } = req.body;

  const userRepository = PostgreDataSource.getRepository(Client);

  const client = new Client();
  client.id = uuidv4();
  client.first_name = firstName;
  client.last_name = lastName;
  client.email = email;
  client.card_number = cardNumber;
  client.balance = balance;

  console.log(client);

  await userRepository.save(client);

  return res.status(201).json(client);
});

PostgreDataSource.initialize()
  .then(async () => {
    app.listen(port, () => {
      console.log(`Server started on port ${port}`);
    });
  })
  .catch((error) => console.log(error));
