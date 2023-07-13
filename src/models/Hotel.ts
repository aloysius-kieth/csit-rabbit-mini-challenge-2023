import mongoose, { Document, Schema } from 'mongoose';

export interface IHotel {
    city: string;
    hotelName: string;
    price: number;
    date: Date;
}

export interface IHotelNameAndPrice {
    hotelName: string;
    price: number;
}

export interface IHotelModel extends IHotel, Document {}

const HotelSchema: Schema = new Schema(
    {
        city: { type: String, required: true },
        hotelName: { type: String, required: true },
        price: { type: Number, required: true },
        date: { type: Date, required: true }
    },
    {
        versionKey: false,
        collection: 'hotels'
    }
);

export default mongoose.model<IHotelModel>('Hotel', HotelSchema);
