import {
  compressed_obj,
  decompressed_obj,
} from "../utils/compression/compression.js";
import UsersService from "../services/users.js";

//console.log(await UsersService.getAll());
//console.log(await UsersService.getById("6e5646a3-697e-4a7f-8d33-53749be48815"));
//console.log(await UsersService.getByEmail("gabrielle.laquerriere@hotmail.com"));
///console.log(await UsersService.getByEmail("manolotsoa.randriambeloniaina@gmail.com"));

export async function get_all_users(req, res) {
  let all_members_data = await UsersService.getAll();
  res.json(compressed_obj(all_members_data));
}

export async function get_userByEmail(req, res) {
  let value = post(req, res);
  let result = await UsersService.getByEmail(value.email);
  res.status(201).json(compressed_obj(result));
}

export async function get_userById(req, res) {
  let value = post(req, res);
  let result = await UsersService.getById(value._id);
  res.status(201).json(compressed_obj(result));
}

function post(req, res) {
  const { data } = req.body;
  if (!data) return res.status(400).json({ error: "données requis" });
  return decompressed_obj(data);
}