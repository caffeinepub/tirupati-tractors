import Text "mo:core/Text";
import Float "mo:core/Float";
import Array "mo:core/Array";
import Nat "mo:core/Nat";
import Map "mo:core/Map";
import Runtime "mo:core/Runtime";
import Iter "mo:core/Iter";
import Principal "mo:core/Principal";

import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";
import Storage "blob-storage/Storage";
import MixinStorage "blob-storage/Mixin";

actor {
  // Initialize the user system state
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);
  include MixinStorage();

  public type UserProfile = {
    name : Text;
  };

  type Product = {
    name : Text;
    model : Text;
    hpMin : Nat;
    hpMax : Nat;
    priceMin : Float;
    priceMax : Float;
    description : Text;
    features : [Text];
    category : Text;
    imageUrl : Text;
    isAvailable : Bool;
  };

  type ShowroomInfo = {
    name : Text;
    address : Text;
    phone : Text;
    email : Text;
  };

  var nextProductId = 1;
  let products = Map.empty<Nat, Product>();
  let userProfiles = Map.empty<Principal, UserProfile>();
  var showroomInfo : ShowroomInfo = {
    name = "Tirupati Tractors";
    address = "123 Main Street, City";
    phone = "123-456-7890";
    email = "contact@tirupatitractors.com";
  };

  // Seed Tractor Data
  let defaultTractors : [Product] = [
    {
      name = "Swaraj 855 FE";
      model = "855 FE";
      hpMin = 52;
      hpMax = 55;
      priceMin = 8.7;
      priceMax = 9.7;
      description = "The Swaraj 855 FE is a 2WD tractor known for its power and versatility.";
      features = ["Dual Clutch", "Power Steering", "Oil-immersed Brakes"];
      category = "Tractor";
      imageUrl = "https://www.tractorjunction.com/upload/tractors/zoom-3af8bbd1-97b8-49bf-8d94-ebb836f4a1c6-1600159452-tractorszoom.png";
      isAvailable = true;
    },
    {
      name = "Swaraj 744 FE";
      model = "744 FE";
      hpMin = 44;
      hpMax = 48;
      priceMin = 6.8;
      priceMax = 7.3;
      description = "The Swaraj 744 FE is a 2WD tractor designed for heavy-duty tasks.";
      features = ["Dual Clutch", "Power Steering", "Dry Disc Brakes"];
      category = "Tractor";
      imageUrl = "https://www.tractorjunction.com/upload/tractors/zoom-98e6f3c0-8c8d-4a2d-9d47-d29fd842075a-1600159453-tractorszoom.png";
      isAvailable = true;
    },
    {
      name = "Swaraj 735 FE";
      model = "735 FE";
      hpMin = 40;
      hpMax = 45;
      priceMin = 5.99;
      priceMax = 6.45;
      description = "The Swaraj 735 FE is a reliable 2WD tractor suitable for various agricultural tasks.";
      features = ["Single Clutch", "Manual Steering", "Dry Disc Brakes"];
      category = "Tractor";
      imageUrl = "https://www.tractorjunction.com/upload/tractors/zoom-f5b1f476-6300-41ee-a9dd-c9f22a51fda9-1600159453-tractorszoom.png";
      isAvailable = true;
    },
    {
      name = "Swaraj 963 FE";
      model = "963 FE";
      hpMin = 60;
      hpMax = 65;
      priceMin = 8.4;
      priceMax = 8.82;
      description = "The Swaraj 963 FE is a powerful 2WD tractor designed for heavy-duty applications.";
      features = ["Dual Clutch", "Power Steering", "Oil-immersed Brakes"];
      category = "Tractor";
      imageUrl = "https://www.tractorjunction.com/upload/tractors/zoom-79c22e44-a4f0-49a8-929f-98c14f6528cc-1600159454-tractorszoom.png";
      isAvailable = true;
    },
    {
      name = "Swaraj Target 630";
      model = "630";
      hpMin = 27;
      hpMax = 30;
      priceMin = 5.3;
      priceMax = 5.6;
      description = "The Swaraj Target 630 is a compact 2WD tractor ideal for small-scale farming tasks.";
      features = ["Single Clutch", "Manual Steering", "Dry Disc Brakes"];
      category = "Mini Tractor";
      imageUrl = "https://www.tractorjunction.com/upload/tractors/zoom-0a9a4030-d3bb-45a2-b046-fd4f0e86e077-1706690489-tractorszoom.png";
      isAvailable = true;
    },
    {
      name = "Swaraj 724 XM Orchard";
      model = "724 XM";
      hpMin = 25;
      hpMax = 30;
      priceMin = 3.7;
      priceMax = 5.2;
      description = "The Swaraj 724 XM Orchard is a specialized 2WD tractor designed for orchard operations.";
      features = ["Single Clutch", "Manual Steering", "Dry Disc Brakes"];
      category = "Orchard Tractor";
      imageUrl = "https://www.tractorjunction.com/upload/tractors/zoom-5be81d5b-f84c-4cba-b1ad-b55ca18c1f8e-1600159445-tractorszoom.png";
      isAvailable = true;
    },
  ];

  for (tractor in defaultTractors.values()) {
    products.add(nextProductId, tractor);
    nextProductId += 1;
  };

  // User Profile Functions
  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can access profiles");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  // Product Management Functions
  public shared ({ caller }) func addProduct(product : Product) : async Nat {
    if (not AccessControl.hasPermission(accessControlState, caller, #admin)) {
      Runtime.trap("Unauthorized: Only admins can add products");
    };
    let productId = nextProductId;
    products.add(productId, product);
    nextProductId += 1;
    productId;
  };

  public shared ({ caller }) func updateProduct(id : Nat, product : Product) : async Bool {
    if (not AccessControl.hasPermission(accessControlState, caller, #admin)) {
      Runtime.trap("Unauthorized: Only admins can update products");
    };
    if (not products.containsKey(id)) {
      Runtime.trap("Product not found");
    };
    products.add(id, product);
    true;
  };

  public shared ({ caller }) func deleteProduct(id : Nat) : async Bool {
    if (not AccessControl.hasPermission(accessControlState, caller, #admin)) {
      Runtime.trap("Unauthorized: Only admins can delete products");
    };
    if (not products.containsKey(id)) {
      Runtime.trap("Product not found");
    };
    products.remove(id);
    true;
  };

  public query ({ caller }) func getProduct(id : Nat) : async ?Product {
    products.get(id);
  };

  public query ({ caller }) func getAllProducts() : async [Product] {
    products.values().toArray();
  };

  public query ({ caller }) func getProductsByCategory(category : Text) : async [Product] {
    let filtered = products.values().toArray().filter(
      func(product) { product.category == category }
    );
    filtered;
  };

  public query ({ caller }) func getShowroomInfo() : async ShowroomInfo {
    showroomInfo;
  };

  public shared ({ caller }) func updateShowroomInfo(info : ShowroomInfo) : async Bool {
    if (not AccessControl.hasPermission(accessControlState, caller, #admin)) {
      Runtime.trap("Unauthorized: Only admins can update showroom info");
    };
    showroomInfo := info;
    true;
  };
};
