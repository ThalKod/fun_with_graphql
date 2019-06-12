const Subscription = {
  count: {
    subscribe: (parents, args, ctx, info) => {
      const { pubsub } = ctx;
      let count = 0;
      setInterval(() => {
        count++;
        pubsub.publish("count", { // publishing the new value
          count
        })
      }, 1000);
      return pubsub.asyncIterator("count"); // Setting up a channel to subscribe
    }
  }
};

export default Subscription;
