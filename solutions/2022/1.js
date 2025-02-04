const VEHICLES = [];
const COMMENTS = [];
const USERS = [];

class User {
  constructor(user) {
    USERS.push(user);
  }
}

class UserComment {
  constructor(comment) {
    COMMENTS.push(comment);
  }
}

class Vehicle {
  constructor(vehicle) {
    VEHICLES.push(vehicle);
  }

  static search_vehicles(params) {
    let result = [];

    for (let i = 0; i < VEHICLES.length; i++) {
      const paramKeysArray = Object.keys(params);
      const paramsValuesArray = Object.values(params);

      for (let k = 0; k < paramKeysArray.length; k++) {
        const key = paramKeysArray[k];
        const value = paramsValuesArray[k];
        if (value !== VEHICLES[i][key]) break;
        else if (k === paramKeysArray.length - 1) result.push(VEHICLES[i]);
      }
    }

    return result;
  }

  static vehicle_details(vehicle_id) {
    const comments = COMMENTS.filter(
      (comment) => comment.vehicleId === vehicle_id
    );
    const vehicles = VEHICLES.find((vehicle) => vehicle.id === vehicle_id);
    return { comments, vehicles };
  }
}

const ahmed = new User({ userIs: "seller", name: "ahmed", id: "ahmed" });

const ahmedVehicle = new Vehicle({
  id: "ahmed_vehicle",
  city: "Abc",
  model: "2022",
  year: "2023",
  price: "4999",
  user: ahmed,
});

const ahmedVehicle2 = new Vehicle({
  id: "ahmed_vehicle2",
  city: "Abc",
  model: "2025",
  year: "2025",
  price: "4999",
  user: ahmed,
});

const ahmedVehicle3 = new Vehicle({
  id: "ahmed_vehicle3",
  city: "Abc",
  model: "2025",
  year: "2025",
  price: "4999",
  user: ahmed,
});

console.log(Vehicle.search_vehicles({ price: "5000" }));

new UserComment({ userId: "ahmed", vehicleId: "ahmed_vehicle", text: "New " });

console.log(Vehicle.vehicle_details("ahmed_vehicle"));
