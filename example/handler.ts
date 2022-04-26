import { serverlessStorage } from "@vulcancreative/serverless-storage";

export async function insert(event) {

  const myTable = process.env.STORAGE_TABLE_NAME;
  //user part is partition key
  //my-user-id is sort key
  const myKey = "user:my-user-id";
  const myValue = event;

  const test = await serverlessStorage.putData(myKey, myValue, myTable);

  return {
    message: "Go Serverless v1.0!",
    input: event,
  }
}

export async function check(event) {

  const myTable = process.env.STORAGE_TABLE_NAME;
  const myKey = "user:my-user-id";

  if(await serverlessStorage.hasData(myKey, myTable)) {
    return {
      message: `exits`,
      input: event,
    };
  } else {
    return {
      message: 'Data not exist',
      input: event,
    };
  }
}

export async function get(event) {

  const myTable = process.env.STORAGE_TABLE_NAME;
  const myKey = "user:my-user-id";
  const data = await serverlessStorage.getData(myKey, myTable);

  let result = null;
  if (data == null) {
    result = "Data not exist";
  } else {
    result = "Data exists";
  }

  return {
    message: `Hello ${result}`,
    data: data,
    input: event,
  };
}
