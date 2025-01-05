import { GraphQLClient, gql } from "graphql-request";

const endpoint =
  "https://api.studio.thegraph.com/query/76349/base-sbt/version/latest";
const client = new GraphQLClient(endpoint, { headers: {} });


export const getSbtChainInfo = async (address: string) => {
  const query = gql`
    query getTokenInfo($address: String!) {
      user(id: $address) {
        created {
          soulId
          creator {
            amount
          }
        }
        id
      }
    }
  `;
  return await client.request(query, { address: address.toLowerCase() });
};
  