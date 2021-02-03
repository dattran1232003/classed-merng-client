export const typePolicies = {
  Query: {
    fields: {
      getPosts: {
        merge: (_, incoming) => incoming
      }
    }
  },
  Post: {
    fields: {
      comments: {
        merge: (_, incoming) => incoming,
      }
    }
  }
}


