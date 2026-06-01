const Header = (props) => <h1>{props.course}</h1>

const Content = (props) => (
  <div>
   {props.parts.map(part => 
     <Part key= {part.id} part = {part}/>
   )}
  </div>
)

const Part = (props) => (
  <p>
    {props.part.name} {props.part.exercises}
  </p>
)

const Total = (props) => <b>Total of {props.total} Exercises</b>


const Course = ({ course }) => {

  const TotalNumber = course.parts.reduce((sum,part) => sum+part.exercises,0)

  return (
    <div>
      <Header course={course.name} />
      <Content parts={course.parts}/>
      <Total
        total={TotalNumber}
      />
    </div>
  )
}

export default Course