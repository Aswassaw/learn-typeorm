import * as express from "express";
import { v4 as uuidv4 } from "uuid";
import { PostgreDataSource } from "../database/data-source";
import { Client } from "../database/entitities/Client";
import { Banker } from "../database/entitities/Banker";
import {
  Transaction,
  TransactionTypes,
} from "../database/entitities/Transaction";

const app = express();
const port = 5000;

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// post client
app.post("/api/client", async (req: express.Request, res: express.Response) => {
  const { firstName, lastName, email, cardNumber, balance } = req.body;

  const clientRepository = PostgreDataSource.getRepository(Client);

  const client = new Client();
  client.id = uuidv4();
  client.first_name = firstName;
  client.last_name = lastName;
  client.email = email;
  client.card_number = cardNumber;
  client.balance = balance;

  await clientRepository.save(client);

  return res.status(201).json(client);
});

// post banker
app.post("/api/banker", async (req: express.Request, res: express.Response) => {
  const { firstName, lastName, email, cardNumber, employeeNumber } = req.body;

  const bankerRepository = PostgreDataSource.getRepository(Banker);

  const banker = new Banker();
  banker.id = uuidv4();
  banker.first_name = firstName;
  banker.last_name = lastName;
  banker.email = email;
  banker.card_number = cardNumber;
  banker.employee_number = employeeNumber;

  await bankerRepository.save(banker);

  return res.status(201).json(banker);
});

// post transaction
app.post(
  "/api/transaction",
  async (req: express.Request, res: express.Response) => {
    const { type, amount, clientId } = req.body;

    const transactionRepository = PostgreDataSource.getRepository(Transaction);
    const clientRepository = PostgreDataSource.getRepository(Client);

    const clientSelected = await clientRepository.findOneBy({
      id: clientId,
    });
    if (!clientSelected) {
      return res.status(404).json({
        code: 404,
        message: "Client Not Found",
      });
    }

    const transaction = new Transaction();
    transaction.id = uuidv4();
    transaction.amount = amount;
    transaction.type = type;
    transaction.client = clientSelected;

    await transactionRepository.save(transaction);

    if (type === TransactionTypes.DEPOSIT) {
      clientSelected.balance = clientSelected.balance + parseInt(amount);
    } else if (type === TransactionTypes.WITHDRAW) {
      clientSelected.balance = clientSelected.balance - parseInt(amount);
    }

    await clientRepository.save(clientSelected);

    return res.status(201).json(transaction);
  }
);

// connect client to banker
app.put(
  "/api/connect-client-banker",
  async (req: express.Request, res: express.Response) => {
    const { clientId, bankerId } = req.body;

    const clientRepository = PostgreDataSource.getRepository(Client);
    const bankerRepository = PostgreDataSource.getRepository(Banker);

    const clientSelected = await clientRepository.findOneBy({
      id: clientId,
    });
    if (!clientSelected) {
      return res.status(404).json({
        code: 404,
        message: "Client Not Found",
      });
    }

    const bankerSelected = await bankerRepository.findOneBy({
      id: bankerId,
    });
    if (!bankerSelected) {
      return res.status(404).json({
        code: 404,
        message: "Banker Not Found",
      });
    }

    bankerSelected.clients = [clientSelected];
    await bankerRepository.save(bankerSelected);

    return res.status(201).json(bankerSelected);
  }
);

// delete client
app.delete(
  "/api/client",
  async (req: express.Request, res: express.Response) => {
    const { clientId } = req.body;

    const clientRepository = PostgreDataSource.getRepository(Client);

    const clientSelected = await clientRepository.findOneBy({
      id: clientId,
    });
    if (!clientSelected) {
      return res.status(404).json({
        code: 404,
        message: "Client Not Found",
      });
    }

    await clientRepository.delete(clientId);

    return res.status(200).json({
      message: "Deleted",
    });
  }
);

// get client
app.get("/api/client", async (req: express.Request, res: express.Response) => {
  // const clientRepository =
  //   PostgreDataSource.getRepository(Client).createQueryBuilder("clients");

  // const clients = await clientRepository
  //   .select("clients.id", "id")
  //   .addSelect("clients.first_name")
  //   .addSelect("clients.last_name")
  //   .addSelect("clients.balance")
  //   .leftJoinAndSelect("clients.transactions", "transactions")
  //   .getMany();

  const clientRepository = PostgreDataSource.getRepository(Client);

  const clients = await clientRepository
    .createQueryBuilder("clients")
    .leftJoinAndSelect("clients.transactions", "transactions")
    .getMany();

  return res.status(200).json({
    message: "Get All",
    data: clients,
  });
});

PostgreDataSource.initialize()
  .then(async () => {
    app.listen(port, () => {
      console.log(`Server started on port ${port}`);
    });
  })
  .catch((error) => console.log(error));
