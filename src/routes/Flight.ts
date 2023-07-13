import express from 'express';
import Flight, { IResponseFlight } from '../models/Flight';
import moment from 'moment';

const router = express.Router();

router.get('', (req, res) => {
    let destination = '';
    let departureDate = '';
    let returnDate = '';
    let validQueries = true;

    let responseDepartureFilteredRecords: Array<IResponseFlight> = [];

    destination = req.query.destination as string;
    departureDate = req.query.departureDate as string;
    returnDate = req.query.returnDate as string;

    // Check req params
    if (!req.query.destination) {
        validQueries = false;
    }
    if (!req.query.departureDate || !moment(departureDate, moment.ISO_8601).isValid()) {
        validQueries = false;
    }
    if (!req.query.returnDate || !moment(returnDate, moment.ISO_8601).isValid()) {
        validQueries = false;
    }

    if (validQueries) {
        Flight.find({
            srccity: {
                $regex: 'singapore',
                $options: 'i'
            },
            destcity: {
                $regex: destination,
                $options: 'i'
            },
            date: {
                $eq: departureDate
            }
        })
            .then((flights) => {
                let records = flights;

                // Match src and dest city
                // Match departure and return date

                // let departureRecords = records.filter((record) => {
                //     return record.srcairport == 'SIN' && record.destcity.toLowerCase() == destination.toLowerCase() && moment(record.date).utc().format('YYYY-MM-DD') == departureDate;
                // });

                // Sort cheapest price
                let sortedDepartureRecords = records.sort((x, y) => (x.price < y.price ? -1 : x.price > y.price ? 1 : 0));

                sortedDepartureRecords.forEach((r) => {
                    let rFlight: IResponseFlight = {
                        airline: r.airlinename,
                        price: r.price
                    };
                    responseDepartureFilteredRecords.push(rFlight);
                });

                // let returnRecords = records.filter((record) => {
                //     return record.srcairport == 'SIN' && record.destcity.toLowerCase() == destination.toLowerCase() && moment(record.date).utc().format('YYYY-MM-DD') == returnDate;
                // });

                Flight.find({
                    srccity: {
                        $regex: destination,
                        $options: 'i'
                    },
                    destcity: {
                        $regex: 'singapore',
                        $options: 'i'
                    },
                    date: {
                        $eq: returnDate
                    }
                })
                    .then((flights) => {
                        // Sort cheapest price
                        let sortedReturnRecords = flights.sort((x, y) => (x.price < y.price ? -1 : x.price > y.price ? 1 : 0));
                        let responseReturnFilteredRecords: Array<IResponseFlight> = [];
                        sortedReturnRecords.forEach((r) => {
                            let rFlight: IResponseFlight = {
                                airline: r.airlinename,
                                price: r.price
                            };
                            responseReturnFilteredRecords.push(rFlight);
                        });

                        let result = [];

                        for (let i = 0; i < responseDepartureFilteredRecords.length; i++) {
                            const departureRecord = responseDepartureFilteredRecords[i];
                            const returnRecord = responseReturnFilteredRecords[i];
                            result.push({
                                City: destination,
                                'Departure Date': departureDate,
                                'Departure Airline': departureRecord.airline,
                                'Departure Price': departureRecord.price,
                                'Return Date': returnDate,
                                'Return Airline': returnRecord.airline,
                                'Return Price': returnRecord.price
                            });
                        }

                        res.status(200).json(result);
                    })
                    .catch((error) => res.status(500).json({ error }));
            })
            .catch((error) => res.status(500).json({ error }));
    } else {
        return res.status(400).json({ message: 'Bad input' });
    }
});

export = router;
