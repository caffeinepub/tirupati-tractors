import Text "mo:core/Text";
import Float "mo:core/Float";
import Nat "mo:core/Nat";
import Map "mo:core/Map";
import Principal "mo:core/Principal";

import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";
import MixinStorage "blob-storage/Mixin";

actor {
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

  type ProductEntry = {
    id : Nat;
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

  // Stable storage that survives upgrades
  stable var stableNextProductId : Nat = 1;
  stable var stableProducts : [(Nat, Product)] = [];
  stable var stableShowroom : ShowroomInfo = {
    name = "Tirupati Tractors";
    address = "Sendhwa Varla Road, Balwadi, Madhya Pradesh";
    phone = "+91 94245 69451";
    email = "Tirupatitractor551@gmail.com";
  };
  stable var stableUserProfiles : [(Principal, UserProfile)] = [];
  stable var seeded : Bool = false;

  var nextProductId = stableNextProductId;
  let products = Map.empty<Nat, Product>();
  var showroomInfo = stableShowroom;
  let userProfiles = Map.empty<Principal, UserProfile>();

  // Restore from stable on startup
  for ((id, p) in stableProducts.values()) {
    products.add(id, p);
  };
  for ((principal, profile) in stableUserProfiles.values()) {
    userProfiles.add(principal, profile);
  };

  system func preupgrade() {
    stableNextProductId := nextProductId;
    stableProducts := products.toArray();
    stableShowroom := showroomInfo;
    stableUserProfiles := userProfiles.toArray();
  };

  let defaultTractors : [Product] = [
    {
      name = "Swaraj 735 FE";
      model = "735 FE";
      hpMin = 40;
      hpMax = 45;
      priceMin = 5.99;
      priceMax = 6.45;
      description = "The Swaraj 735 FE is a reliable 2WD tractor suitable for various agricultural tasks.";
      features = ["Single Clutch", "Manual Steering", "Dry Disc Brakes"];
      category = "Tractors";
      imageUrl = "";
      isAvailable = true;
    },
    {
      name = "Swaraj 744 XT";
      model = "744 XT";
      hpMin = 44;
      hpMax = 50;
      priceMin = 7.0;
      priceMax = 7.8;
      description = "The Swaraj 744 XT is our best-selling model, offering excellent performance and fuel efficiency.";
      features = ["Dual Clutch", "Power Steering", "Oil-immersed Brakes", "Hi-Lo Gear"];
      category = "Tractors";
      imageUrl = "";
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
      category = "Tractors";
      imageUrl = "";
      isAvailable = true;
    },
    {
      name = "Swaraj 855 FE";
      model = "855 FE";
      hpMin = 52;
      hpMax = 55;
      priceMin = 8.7;
      priceMax = 9.7;
      description = "The Swaraj 855 FE is a 2WD tractor known for its power and versatility.";
      features = ["Dual Clutch", "Power Steering", "Oil-immersed Brakes"];
      category = "Tractors";
      imageUrl = "";
      isAvailable = true;
    },
    {
      name = "Swaraj 855 XM";
      model = "855 XM";
      hpMin = 52;
      hpMax = 57;
      priceMin = 9.0;
      priceMax = 10.0;
      description = "The Swaraj 855 XM offers advanced features for modern farming needs.";
      features = ["Dual Clutch", "Power Steering", "Oil-immersed Brakes", "4WD Option"];
      category = "Tractors";
      imageUrl = "";
      isAvailable = true;
    },
  ];

  // Only seed defaults on very first deploy
  if (not seeded) {
    for (tractor in defaultTractors.values()) {
      products.add(nextProductId, tractor);
      nextProductId += 1;
    };
    seeded := true;
  };

  func productToEntry(id : Nat, p : Product) : ProductEntry {
    {
      id = id;
      name = p.name;
      model = p.model;
      hpMin = p.hpMin;
      hpMax = p.hpMax;
      priceMin = p.priceMin;
      priceMax = p.priceMax;
      description = p.description;
      features = p.features;
      category = p.category;
      imageUrl = p.imageUrl;
      isAvailable = p.isAvailable;
    }
  };

  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    userProfiles.get(caller);
  };

  public query func getUserProfile(user : Principal) : async ?UserProfile {
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    userProfiles.add(caller, profile);
  };

  public shared ({ caller }) func claimAdminByEmail(email : Text) : async Bool {
    if (email == "sj913180@gmail.com" or email == "515151") {
      accessControlState.userRoles.add(caller, #admin);
      true;
    } else {
      false;
    };
  };

  public shared func addProduct(product : Product) : async Nat {
    let productId = nextProductId;
    products.add(productId, product);
    nextProductId += 1;
    productId;
  };

  public shared func updateProduct(id : Nat, product : Product) : async Bool {
    switch (products.get(id)) {
      case null { false };
      case (?_) {
        products.add(id, product);
        true;
      };
    };
  };

  public shared func deleteProduct(id : Nat) : async Bool {
    switch (products.get(id)) {
      case null { false };
      case (?_) {
        products.remove(id);
        true;
      };
    };
  };

  public query func getProduct(id : Nat) : async ?Product {
    products.get(id);
  };

  public query func getAllProducts() : async [ProductEntry] {
    products.toArray().map(func((id, p) : (Nat, Product)) : ProductEntry {
      productToEntry(id, p)
    });
  };

  public query func getProductsByCategory(category : Text) : async [ProductEntry] {
    products.toArray()
      .filter(func((_, p) : (Nat, Product)) : Bool { p.category == category })
      .map(func((id, p) : (Nat, Product)) : ProductEntry {
        productToEntry(id, p)
      });
  };

  public query func getShowroomInfo() : async ShowroomInfo {
    showroomInfo;
  };

  public shared func updateShowroomInfo(info : ShowroomInfo) : async Bool {
    showroomInfo := info;
    true;
  };
};
