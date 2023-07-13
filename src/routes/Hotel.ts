import express from 'express';
import Hotel, { IHotelNameAndPrice } from '../models/Hotel';
import moment from 'moment';

const router = express.Router();

router.get('', (req, res) => {
    let destination: string = '';
    let checkInDate: string = '';
    let checkOutDate: string = '';
    let validQueries = true;

    destination = req.query.destination as string;
    checkInDate = req.query.checkInDate as string;
    checkOutDate = req.query.checkOutDate as string;

    // Check req params
    if (!destination) {
        validQueries = false;
    }
    if (!checkInDate || !moment(checkInDate, moment.ISO_8601).isValid()) {
        validQueries = false;
    }
    if (!checkOutDate || !moment(checkOutDate, moment.ISO_8601).isValid()) {
        validQueries = false;
    }
    let checkInDateISO = moment.utc(checkInDate, 'YYYY/MM/DD');
    let checkOutDateISO = moment.utc(checkOutDate, 'YYYY/MM/DD');

    if (validQueries) {
        Hotel.find({
            city: {
                $regex: destination,
                $options: 'i'
            },
            date: {
                $gte: checkInDateISO.toDate().getTime(),
                $lte: checkOutDateISO.toDate().getTime()
            }
        })
            .then((hotels) => {
                // // Filtered by queries given
                // let filteredHotelRecords = records.filter((record) => {
                //     return (
                //         record.city.toLowerCase() == destination.toLowerCase() &&
                //         record.date.getTime() >= checkInDateISO.toDate().getTime() &&
                //         record.date.getTime() <= checkOutDateISO.toDate().getTime()
                //     );
                // });

                // // Arrange by hotel name
                let filteredHotelRecordsByHotelName: Array<IHotelNameAndPrice> = [];

                // Filtered out and combined hotel names and prices
                let combinedHotelNameAndPrices = Array.from(new Set(hotels.map((x) => x.hotelName)));
                combinedHotelNameAndPrices
                    .map((x) => hotels.filter((y) => y.hotelName === x))
                    .map((x, i) => {
                        filteredHotelRecordsByHotelName.push(<IHotelNameAndPrice>{
                            hotelName: combinedHotelNameAndPrices[i],
                            price: x.reduce((a, b) => a + b.price, 0)
                        });
                    });

                let result = [];
                for (let i = 0; i < filteredHotelRecordsByHotelName.length; i++) {
                    const r = filteredHotelRecordsByHotelName[i];
                    result.push({
                        City: destination,
                        'Check In Date': checkInDate,
                        'Check Out Date': checkOutDate,
                        Hotel: r.hotelName,
                        Price: r.price
                    });
                }

                result = result.sort((x, y) => (x.Price < y.Price ? -1 : x.Price > y.Price ? 1 : 0));

                res.status(200).json(result);
            })
            .catch((error) => res.status(500).json({ error }));
    } else {
        return res.status(400).json({ message: 'Bad input' });
    }
});

export = router;
