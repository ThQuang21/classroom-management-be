const GradeComposition = require('../models/class');
const Class = require('../models/class');
const Grade = require('../models/grade');
const User = require('../models/user');
const StatusCodes = require('http-status-codes');

async function createGrades(req, res) {
  try {
    const { classCode, students } = req.body;

    // Validate if the request body contains the required data
    if (!classCode || !students || !Array.isArray(students) || students.length === 0) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        status: StatusCodes.BAD_REQUEST,
        error: {
          code: 'bad_request',
          message: 'Invalid request body. Please provide classCode and an array of students.',
        },
      });
    }

    // Create an array to store grades for each student
    const gradesArray = [];

    // Loop through the students array and create a grade for each
    for (const student of students) {
      const { studentId, fullName, email } = student;

      // Validate if the student data contains the required fields
      if (!studentId) {
        return res.status(StatusCodes.BAD_REQUEST).json({
          status: StatusCodes.BAD_REQUEST,
          error: {
            code: 'bad_request',
            message: 'Invalid student data. Please provide studentId and fullName for each student.',
          },
        });
      }

      const studentData = {
        studentId,
        fullName
      }

       // Find the user by studentId
       const user = await User.findOne({ studentId });
       if (user) {
        studentData.push(user.email)
       }

      // Create a grade object for the student
      const grade = {
        student: {
          studentId,
          fullName,
          email,
        },
        classCode,
        grades: [], // You can add grades data later as needed
      };

      // Find the grade composition by classCode
      const foundClass = await Class.Class.findOne({ classCode });
      console.log(foundClass)
       if (foundClass) {
        grade.grades = foundClass.gradeCompositions.map((structure) => ({
          gradeCompositionId: structure._id,
          grade: 0, // You can set the default grade value
        }));
  
        gradesArray.push(grade);
       }
    }

    // Create grades in the database
    const createdGrades = await Grade.insertMany(gradesArray);

    return res.status(StatusCodes.CREATED).json({
      status: StatusCodes.CREATED,
      data: createdGrades,
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

async function getGradesByClassCode(req, res) {
  try {
    const { classCode } = req.params;

    // Validate if the classCode is provided
    if (!classCode) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        status: StatusCodes.BAD_REQUEST,
        error: {
          code: 'bad_request',
          message: 'Please provide a valid classCode.',
        },
      });
    }

    // Find grades based on the provided classCode
    const grades = await Grade.find({ classCode : classCode });
    const foundClass = await Class.Class.findOne({ classCode });
    const studentGradesMap = new Map();

    grades.forEach((grade) => {
      const { studentId, fullName } = grade.student;

      if (!studentGradesMap.has(studentId)) {
        studentGradesMap.set(studentId, {
          fullName,
          studentId
        });
      }

      const studentData = studentGradesMap.get(studentId);
      
      for (let i = 0; i < grade.grades.length; i++) {
        const gradeCompositionId = grade.grades[i].gradeCompositionId;

        const gradeComposition = foundClass.gradeCompositions.find(
          (composition) => composition._id.toString() === gradeCompositionId.toString()
        );

        // Add the grade to the student data
        studentData[gradeComposition.name] = grade.grades[i].grade;
      }

    });

    // Convert the map values to an array
    const studentsDataArray = Array.from(studentGradesMap.values());

    console.log(studentsDataArray)

    return res.status(StatusCodes.OK).json({
      status: StatusCodes.OK,
      data: studentsDataArray,
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
  createGrades,
  getGradesByClassCode
};