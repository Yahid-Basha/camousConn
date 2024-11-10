import { Request, Response } from 'express';
import CampusInfo from '../models/campusInfo';

export const getCampusInfo = async (req: Request, res: Response) => {
    const { regulation, department } = req.query;

    try {
        const campusInfo = await CampusInfo.findOne({ regulation, department });
        if (!campusInfo) {
            
            return res.status(404).json({ message: 'Campus information not found' });
        }
        res.json(campusInfo);
    } catch (error) {
        console.error('Error fetching campus information',error);
        res.status(500).json({ message: 'Error fetching campus information' });
    }
};
