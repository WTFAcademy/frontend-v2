import { GraphQLClient, gql } from "graphql-request";

// Previous Base subgraph:
// "https://api.studio.thegraph.com/query/76349/base-sbt/version/latest"
const endpoint = process.env.NEXT_PUBLIC_SBT_GRAPH_URL;

const getClient = () => {
  if (!endpoint) {
    throw new Error(
      "NEXT_PUBLIC_SBT_GRAPH_URL is not set. Configure the SBT subgraph endpoint before querying."
    );
  }
  return new GraphQLClient(endpoint, { headers: {} });
};

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
  return await getClient().request(query, { address: address.toLowerCase() });
};
  