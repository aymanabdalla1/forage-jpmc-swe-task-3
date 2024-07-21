import { ServerRespond } from './DataStreamer';

export interface Row {  //updating the interface to include the upper_bound, lowerbound and trigger_alert
  price_abc: number,
  price_def: number,
  ratio: number,
  timestamp: Date,
  upper_bound: number,
  lowerbound: number,
  trigger_alert: number | undefined
}


export class DataManipulator {
  static generateRow(serverResponds: ServerRespond[]) {
    const priceABC = (serverResponds[0].top_ask.price + serverResponds[0].top_bid.price) / 2; //calculating the average price of stock ABC
    const priceDEF = (serverResponds[1].top_ask.price + serverResponds[1].top_bid.price) / 2; //calculating the average price of stock DEF
    const ratio = priceABC / priceDEF; //calculating the ratio of the price of stock ABC to stock DEF
    const upperBound = 1 + 0.05; //setting the upper bound to 5% above the ratio
    const lowerBound = 1 - 0.05; //setting the lower bound to 5% below the ratio

    return {
      price_abc: priceABC,
      price_def: priceDEF,
      ratio,
      timestamp: serverResponds[0].timestamp > serverResponds[1].timestamp ?
                 serverResponds[0].timestamp : serverResponds[1].timestamp,
      upper_bound: upperBound,
      lower_bound: lowerBound,
      trigger_alert: (ratio > upperBound || ratio < lowerBound) ? ratio : undefined, //setting the trigger alert to the ratio if it crosses the upper or lower bound
    };
  }
}
