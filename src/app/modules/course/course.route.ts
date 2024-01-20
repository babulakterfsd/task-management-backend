import express from 'express';
import { CourseControllers } from './course.controller';

const router = express.Router();

router.get('/best', CourseControllers.getBestCourse);

export const CourseRoutes = router;
