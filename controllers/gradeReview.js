const GradeReview = require('../models/gradeReview');
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

module.exports = { 
  createGradeReviews
};