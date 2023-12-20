const GradeReview = require('../models/gradeReview');
const MyClass = require('../models/class');
const Class = MyClass.Class;
const StatusCodes = require('http-status-codes');

async function createGradeReviews(req, res) {
  try {
    const {
      classCode,
      gradeCompositionId,
      studentId,
      expectationGrade,
      explanation,
    } = req.body;
    // Save the GradeReview to the database
    const savedGradeReview = await GradeReview.create({
      classCode: req.body.classCode,
      gradeCompositionId: req.body.gradeCompositionId,
      studentId: req.body.studentId,
      expectationGrade: req.body.expectationGrade,
      explanation: req.body.explanation
    });

    await savedGradeReview.save();

    return res.status(StatusCodes.CREATED).json({
      status: StatusCodes.CREATED,
      error: {
        code: 'grade_review_created',
        data: savedGradeReview
      },
    });

  } catch (err) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      status: StatusCodes.BAD_REQUEST,
      error: {
        code: 'bad_request',
        message: err.message,
      },
    });
  }
}

async function getGradeReviewsByClassCodeAndStudentId(req, res) {
  try {
    const { studentId, classCode } = req.params;
    const gradeReviews = await GradeReview.find({ studentId, classCode });
    const foundClass = await Class.findOne({ classCode });

    for (const gradeReview of gradeReviews) {

      const gradeComposition = foundClass.gradeCompositions.find(
        (composition) => composition.id === gradeReview.gradeCompositionId.toString()
      );
      const gradeCompositionName = gradeComposition ? gradeComposition.name : 'Unknown Name';

      // Convert GradeReview to plain JavaScript object and add the gradeCompositionName field
      const gradeReviewObject = gradeReview.toObject();
      gradeReviewObject.gradeCompositionName = gradeCompositionName;

      // Replace the original GradeReview with the enhanced object
      gradeReviews[gradeReviews.indexOf(gradeReview)] = gradeReviewObject;
    }

    return res.status(StatusCodes.OK).json({
      status: StatusCodes.OK,
      data: gradeReviews,
    });

  } catch (err) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      status: StatusCodes.BAD_REQUEST,
      error: {
        code: 'bad_request',
        message: err.message,
      },
    });
  }
}

module.exports = { 
  createGradeReviews,
  getGradeReviewsByClassCodeAndStudentId
};