// import { useState } from "react";
// import { registerUser } from "../services/api";

// function Register() {
//   const [form, setForm] = useState({
//     name: "",
//     email: "",
//     password: ""
//   });

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     try {
//       const res = await registerUser(form);
//       alert("Registered successfully");
//     } catch (err) {
//       console.log(err.response?.data || err.message);
//     }
//   };

//   return (
//     <form onSubmit={handleSubmit}>
//       <h2>Register</h2>

//       <input
//         placeholder="Name"
//         onChange={(e) =>
//           setForm({ ...form, name: e.target.value })
//         }
//       />

//       <input
//         placeholder="Email"
//         onChange={(e) =>
//           setForm({ ...form, email: e.target.value })
//         }
//       />

//       <input
//         type="password"
//         placeholder="Password"
//         onChange={(e) =>
//           setForm({ ...form, password: e.target.value })
//         }
//       />

//       <button type="submit">Register</button>
//     </form>
//   );
// }
// export default Register;