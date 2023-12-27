const GradeReview = require('../models/gradeReview');
const MyClass = require('../models/class');
const Class = MyClass.Class;
const User = require('../models/user');
const Grade = require('../models/grade');
const StatusCodes = require('http-status-codes');

async function createGradeReviews(req, res) {
  try {
    const {
      classCode,
      gradeCompositionId,
      studentId,
      currentGrade,
      expectationGrade,
      explanation,
    } = req.body;
    // Save the GradeReview to the database
    
    const existingGradeReview = await GradeReview.findOne({  
      classCode: req.body.classCode,
      gradeCompositionId: req.body.gradeCompositionId,
      studentId: req.body.studentId
    });

    if (existingGradeReview) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        status: StatusCodes.NOT_FOUND,
        error: {
          code: 'not_found',
          message: 'You already request for this grade composition.',
        },
      });
    }

    const savedGradeReview = await GradeReview.create({
      classCode: req.body.classCode,
      gradeCompositionId: req.body.gradeCompositionId,
      studentId: req.body.studentId,
      currentGrade: req.body.currentGrade,
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

async function getGradeReviewsByClassCode(req, res) {
  try {
    const { classCode } = req.params;
    const gradeReviews = await GradeReview.find({ classCode });
    const foundClass = await Class.findOne({ classCode });
    for (const gradeReview of gradeReviews) {

      const gradeComposition = foundClass.gradeCompositions.find(
        (composition) => composition.id === gradeReview.gradeCompositionId.toString()
      );
      const gradeCompositionName = gradeComposition ? gradeComposition.name : 'Unknown Name';

      for (const comment of gradeReview.comments) {
        console.log(comment)
        const existingUser = await User.findOne({ email: comment.commenter });
        comment.commenter = existingUser.name
      }

      // Convert GradeReview to plain JavaScript object and add the gradeCompositionName field
      const gradeReviewObject = gradeReview.toObject();
      gradeReviewObject.gradeCompositionName = gradeCompositionName;

      //add name marked
      if (gradeReview.finalDecision.markedBy) {
        const markedName = await User.findOne({ _id: gradeReview.finalDecision.markedBy });
        gradeReviewObject.finalDecision.markedName = markedName.name;
      }

      //add name student
      const studentName = await User.findOne({ _id: gradeReview.studentId });
      gradeReviewObject.studentName = studentName.studentId;

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

      for (const comment of gradeReview.comments) {
        console.log(comment)
        const existingUser = await User.findOne({ email: comment.commenter });
        comment.commenter = existingUser.name
      }

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

async function getGradeReviewsByClassCodeAndStudentIds(req, res) {
  try {
    const { classCode, studentIds } = req.body;

    const users = await User.find({ studentId: { $in: studentIds } });
    const userIds = users.map((user) => user._id);

    const gradeReviews = await GradeReview.find({
      classCode: classCode,
      studentId: { $in: userIds },
    });

    console.log(gradeReviews)

    const foundClass = await Class.findOne({ classCode });

    for (const gradeReview of gradeReviews) {

      const gradeComposition = foundClass.gradeCompositions.find(
        (composition) => composition.id === gradeReview.gradeCompositionId.toString()
      );
      const gradeCompositionName = gradeComposition ? gradeComposition.name : 'Unknown Name';

      for (const comment of gradeReview.comments) {
        // console.log(comment)
        const existingUser = await User.findOne({ email: comment.commenter });
        comment.commenter = existingUser.name
      }

      // Convert GradeReview to plain JavaScript object and add the gradeCompositionName field
      const gradeReviewObject = gradeReview.toObject();
      gradeReviewObject.gradeCompositionName = gradeCompositionName;

      const studentName = await User.findOne({ _id: gradeReview.studentId });
      gradeReviewObject.studentName = studentName.studentId;

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

async function addCommentByClassCodeStudentIdAndGradeCompositionId(req, res) {
  try {
    const { classCode, studentId, gradeCompositionId, commenter, comment } = req.body;
    const gradeReview = await GradeReview.findOne({
      classCode: classCode,
      studentId: studentId,
      gradeCompositionId: gradeCompositionId,
    });

    if (!gradeReview) {
      return res.status(404).json({ error: 'Grade review not found.' });
    }

    gradeReview.comments.push({
      commenter: commenter,
      comment: comment,
    });


    await gradeReview.save();

    for (const comment of gradeReview.comments) {
      const existingUser = await User.findOne({ email: comment.commenter });
      comment.commenter = existingUser.name
    }

    return res.status(StatusCodes.OK).json({
      status: StatusCodes.OK,
      data: gradeReview,
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

async function updateFinalDecision(req, res) {
  try {
    const { classCode, gradeCompositionId, studentId, studentName, grade, markedBy } = req.body;

    // Find the grade review based on classCode, gradeCompositionId, and studentId
    const gradeReview = await GradeReview.findOne({
      classCode: classCode,
      gradeCompositionId: gradeCompositionId,
      studentId: studentId,
    });

    if (!gradeReview) {
      return res.status(StatusCodes.NOT_FOUND).json({
        status: StatusCodes.NOT_FOUND,
        error: {
          code: 'not_found',
          message: 'Grade review not found.',
        },
      });
    }

    // Update the finalDecision fields
    gradeReview.finalDecision.grade = grade;
    gradeReview.finalDecision.markedBy = markedBy;

    // Save the updated grade review
    await gradeReview.save();

    //Update grade
    const query = { classCode };
    query['student.studentId'] = studentName;
    query['grades.gradeCompositionId'] = gradeCompositionId;
    const foundGrade = await Grade.findOne(query);
    console.log(foundGrade)
    foundGrade.grades.grade = grade;

    const gradeIndexToUpdate = foundGrade.grades.findIndex(
      (grade) => grade.gradeCompositionId.equals(gradeCompositionId)
    );
    if (gradeIndexToUpdate !== -1) {
      foundGrade.grades[gradeIndexToUpdate].grade = grade;
    }
  
    await foundGrade.save();

    return res.status(StatusCodes.OK).json({
      status: StatusCodes.OK,
      data: gradeReview,
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
  getGradeReviewsByClassCode,
  getGradeReviewsByClassCodeAndStudentId,
  getGradeReviewsByClassCodeAndStudentIds,
  addCommentByClassCodeStudentIdAndGradeCompositionId,
  updateFinalDecision
};