import mongoose, { Document, Schema } from 'mongoose';

export interface IFlight {
    airline: string;
    airlineid: number;
    srcairport: string;
    srcairportid: number;
    destairport: string;
    destairportid: number;
    codeshare: string;
    stop: number;
    eq: string;
    airlinename: string;
    srcairportname: string;
    srccity: string;
    srccountry: string;
    destairportname: string;
    destcity: string;
    destcountry: string;
    price: Number;
    date: Date;
}

export interface IResponseFlight {
    airline: String;
    price: Number;
}

export interface IFlightModel extends IFlight, Document {}

const FlightSchema: Schema = new Schema(
    {
        airline: { type: String, required: true },
        airlineid: { type: Number, required: true },
        srcairport: { type: String, required: true },
        srcairportid: { type: Number, required: true },
        destairport: { type: String, required: true },
        destairportid: { type: Number, required: true },
        codeshare: { type: String, required: true },
        stop: { type: Number, required: true },
        eq: { type: String, required: true },
        airlinename: { type: String, required: true },
        srcairportname: { type: String, required: true },
        srccity: { type: String, required: true },
        srccountry: { type: String, required: true },
        destairportname: { type: String, required: true },
        destcity: { type: String, required: true },
        price: { type: Number, required: true },
        date: { type: Date, required: true }
    },
    {
        versionKey: false,
        collection: 'flights'
    }
);

export default mongoose.model<IFlightModel>('Flight', FlightSchema);
