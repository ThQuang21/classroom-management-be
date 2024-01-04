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
        studentData.email = user.email;
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
          grade: -1, // You can set the default grade value
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
      
      // console.log('grade', grade);
      let total = 0;
      for (let i = 0; i < grade.grades.length; i++) {
        const gradeCompositionId = grade.grades[i].gradeCompositionId;

        const gradeComposition = foundClass.gradeCompositions.find(
          (composition) => composition.id.toString() === gradeCompositionId.toString()
        );

        // Add the grade to the student data
        if (grade.grades[i].grade === -1) {
          studentData[gradeComposition.name] = "";
        } else {
          studentData[gradeComposition.name] = grade.grades[i].grade;
          // Count total 
          total += grade.grades[i].grade * gradeComposition.gradeScale;
        }
       
      }
      const gradeTotal = total / 100;
      studentData["total"] = Number(gradeTotal.toFixed(2));
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

async function getGradeByClassCodeAndStudentId(req, res) {
  try {
    const { classCode, studentId } = req.params;

    // Validate if both classCode and studentId are provided
    if (!classCode || !studentId) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        status: StatusCodes.BAD_REQUEST,
        error: {
          code: 'bad_request',
          message: 'Please provide valid classCode and studentId.',
        },
      });
    }

    // Find the grade based on the provided classCode and studentId
    const grade = await Grade.findOne({ classCode, 'student.studentId': studentId });

    if (!grade) {
      return res.status(StatusCodes.NOT_FOUND).json({
        status: StatusCodes.NOT_FOUND,
        error: {
          code: 'not_found',
          message: 'Grade not found with your student ID.',
        },
      });
    }

    console.log(grade)
    const studentData = {
      fullName: grade.student.fullName,
      studentId: grade.student.studentId,
    };

    for (let i = 0; i < grade.grades.length; i++) {
      const gradeCompositionId = grade.grades[i].gradeCompositionId;

      // Add the grade to the student data
      studentData[gradeCompositionId] = grade.grades[i].grade;
    }

    return res.status(StatusCodes.OK).json({
      status: StatusCodes.OK,
      data: studentData,
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
      const { fullName, studentId, id, total, ...gradeDetails } = gradeToUpdate;

      // Find the student's grades by classCode and fullName
      const query = { classCode };
      if (studentId) {
        query['student.studentId'] = studentId;
      }
      if (fullName) {
        query['student.fullName'] = fullName;
      }
      
      const foundGrade = await Grade.findOne(query);
      // console.log('foundGrade', foundGrade)
      // console.log('studentId', studentId)
      console.log('gradeDetails', gradeDetails)
    

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

      if (studentId) {
        foundGrade.student.studentId = studentId;
      }

      if (fullName) {
        foundGrade.student.fullName = fullName;
      }

      // console.log(foundGrade)

      const foundClass = await Class.Class.findOne({ classCode });
      for (const [gradeCompositionName, gradeValue] of Object.entries(gradeDetails)) {
        // console.log(gradeCompositionName)
        // console.log(gradeValue)

        if (isNaN(gradeValue)) {
          return res.status(StatusCodes.BAD_REQUEST).json({
            status: StatusCodes.BAD_REQUEST,
            error: {
              code: 'bad_request',
              message: `Invalid grade value for ${gradeCompositionName}. Grade value must be a number.`,
            },
          });
        } else if (gradeValue < -1 || gradeValue > 10) {
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

        // if (!foundGradeComposition) {
        //   return res.status(StatusCodes.NOT_FOUND).json({
        //     status: StatusCodes.NOT_FOUND,
        //     error: {
        //       code: 'not_found',
        //       message: `GradeComposition ${gradeCompositionName} not found.`,
        //     },
        //   });
        // }

        const gradeIndex = foundGrade.grades.findIndex(
          (grade) => String(grade.gradeCompositionId) === String(foundGradeComposition.id)
        );

        // console.log("*******", gradeIndex)
        if (gradeIndex !== -1) {
          // Update the grade value
          // console.log("*******", gradeValue)
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
  updateGradeByClassCodeAndStudentId,
  getGradeByClassCodeAndStudentId
};