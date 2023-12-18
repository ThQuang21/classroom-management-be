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

      // Check if a grade already exists for the given classCode and studentId
      const existingGrade = await Grade.findOne({ classCode, 'student.studentId': studentId });

      if (existingGrade) {
        // Skip inserting a new grade if one already exists
        console.log(`Grade already exists for student with ID ${studentId} in class ${classCode}`);
        continue;
      }

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
      console.log('foundClass', foundClass)
       if (foundClass) {
        grade.grades = foundClass.gradeCompositions.map((structure) => ({
          gradeCompositionId: structure.id,
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
      
      console.log('grade', grade);

      for (let i = 0; i < grade.grades.length; i++) {
        const gradeCompositionId = grade.grades[i].gradeCompositionId;

        const gradeComposition = foundClass.gradeCompositions.find(
          (composition) => composition.id.toString() === gradeCompositionId.toString()
        );

        // Add the grade to the student data
        studentData[gradeComposition.name] = grade.grades[i].grade;
      }

    });

    // Convert the map values to an array
    const studentsDataArray = Array.from(studentGradesMap.values());

    // console.log(studentsDataArray)

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

async function getGradesByGradeComposition(req, res) {
  try {
    const { gradeComposition } = req.params;

    // Find grades based on the provided classCode
    const grades = await Grade.find(
      { 'grades.gradeCompositionId': gradeComposition },
      { 'student': 1, 'grades.$': 1 } // Projection to include 'student' and the matching 'grades' array element
    );
    
    return res.status(StatusCodes.OK).json({
      status: StatusCodes.OK,
      data: grades,
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

async function updateGradeByClassCodeAndStudentId(req, res) {
  try {
    const { classCode } = req.params;
    const gradesToUpdate = req.body.gradesToUpdate; 

    for (const gradeToUpdate of gradesToUpdate) {
      const { fullName, studentId, id, ...gradeDetails } = gradeToUpdate;

      // Find the student's grades by classCode and fullName
      const foundGrade = await Grade.findOne({ classCode, $or: [{ 'student.studentId': studentId }, { 'student.fullName': fullName }] });

      if (!foundGrade) {
        // Create an array to store grades for each student
        const gradesArray = [];

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
            fullName
          },
          classCode,
          grades: [], // You can add grades data later as needed
        };

        // Find the grade composition by classCode
        const foundClass = await Class.Class.findOne({ classCode });
        console.log('foundClass', foundClass)
        if (foundClass) {
          grade.grades = foundClass.gradeCompositions.map((structure) => ({
            gradeCompositionId: structure.id,
            grade: 0, // You can set the default grade value
          }));
    
          gradesArray.push(grade);
        }

        // Create grades in the database
        const createdGrades = await Grade.insertMany(gradesArray);

        return res.status(StatusCodes.CREATED).json({
          status: StatusCodes.CREATED,
          data: createdGrades,
        });
      }
      foundGrade.student.studentId = studentId;
      foundGrade.student.fullName = fullName;

      // console.log(gradeDetails)

      const foundClass = await Class.Class.findOne({ classCode });
      for (const [gradeCompositionName, gradeValue] of Object.entries(gradeDetails)) {
        console.log(gradeCompositionName)
        console.log(gradeValue)

        if (isNaN(gradeValue)) {
          return res.status(StatusCodes.BAD_REQUEST).json({
            status: StatusCodes.BAD_REQUEST,
            error: {
              code: 'bad_request',
              message: `Invalid grade value for ${gradeCompositionName}. Grade value must be a number.`,
            },
          });
        } else if (gradeValue < 0 || gradeValue > 10) {
          return res.status(StatusCodes.BAD_REQUEST).json({
            status: StatusCodes.BAD_REQUEST,
            error: {
              code: 'bad_request',
              message: `Invalid grade value for ${gradeCompositionName}. Grade value must be between 0 and 10.`,
            },
          });
        }

        // Find the gradeComposition by name
        const foundGradeComposition = foundClass.gradeCompositions.find(
          (composition) => composition.name === gradeCompositionName
        );

        if (!foundGradeComposition) {
          return res.status(StatusCodes.NOT_FOUND).json({
            status: StatusCodes.NOT_FOUND,
            error: {
              code: 'not_found',
              message: `GradeComposition ${gradeCompositionName} not found.`,
            },
          });
        }

        const gradeIndex = foundGrade.grades.findIndex(
          (grade) => String(grade.gradeCompositionId) === String(foundGradeComposition.id)
        );

        console.log("*******", gradeIndex)
        if (gradeIndex !== -1) {
          // Update the grade value
          console.log("*******", gradeValue)
          foundGrade.grades[gradeIndex].grade = Number(gradeValue);
  
          // Save the updated grade document
          await foundGrade.save();
        }
      }
    }

    return res.status(StatusCodes.OK).json({
      status: StatusCodes.OK,
      message: 'Grades updated successfully.',
    });

        // // Find grades based on the provided classCode
        // const grades = await Grade.find({ classCode : classCode });
        // const foundClass = await Class.Class.findOne({ classCode });
        // const studentGradesMap = new Map();
    
        // grades.forEach((grade) => {
        //   const { studentId, fullName } = grade.student;
    
        //   if (!studentGradesMap.has(studentId)) {
        //     studentGradesMap.set(studentId, {
        //       fullName,
        //       studentId
        //     });
        //   }
    
        //   const studentData = studentGradesMap.get(studentId);
          
        //   console.log('grade', grade);
    
        //   for (let i = 0; i < grade.grades.length; i++) {
        //     const gradeCompositionId = grade.grades[i].gradeCompositionId;
    
        //     const gradeComposition = foundClass.gradeCompositions.find(
        //       (composition) => composition.id.toString() === gradeCompositionId.toString()
        //     );
    
        //     // Add the grade to the student data
        //     studentData[gradeComposition.name] = grade.grades[i].grade;
        //   }
    
        // });
    
        // // Convert the map values to an array
        // const studentsDataArray = Array.from(studentGradesMap.values());
    
        // // console.log(studentsDataArray)
    
        // return res.status(StatusCodes.OK).json({
        //   status: StatusCodes.OK,
        //   data: studentsDataArray,
        // });

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
  getGradesByClassCode,
  getGradesByGradeComposition,
  updateGradeByClassCodeAndStudentId
};