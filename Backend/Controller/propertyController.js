import Property from "../Model/propertyModel.js";

export const submitPropertyRequest = async (req, res) => {
  try {
    const image = req.file?.filename || null;
    const newProperty = new Property({ ...req.body, image });
    await newProperty.save();
    res.status(201).json({ message: "Request submitted for approval." });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const approvePropertyRequest = async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);
    if (!property) return res.status(404).json({ message: "Property not found" });

    if (property.requestType === "delete") {
      await Property.findByIdAndDelete(property._id);
      return res.json({ message: "Property deleted." });
    }

    if (property.requestType === "update" && property.originalPropertyId) {
      const original = await Property.findById(property.originalPropertyId);
      if (original) {
        original.title = property.title;
        original.description = property.description;
        original.contactName = property.contactName;
        original.contactNumber = property.contactNumber;
        original.propertyType = property.propertyType;
        original.district = property.district;
        original.price = property.price;
        if (property.image) original.image = property.image;
        await original.save();
        await Property.findByIdAndDelete(property._id);
        return res.json({ message: "Property updated successfully." });
      } else {
        return res.status(404).json({ message: "Original property not found." });
      }
    }

    // default approval (new add request)
    property.status = "approved";
    property.requestType = "add";
    await property.save();
    res.json({ message: "Property approved." });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// In your propertyController.js
export const getAllProperties = async (req, res) => {
  try {
    const { district, propertyType, minPrice, maxPrice } = req.query;
    let query = { status: "approved" };

    if (district) query.district = { $regex: district, $options: 'i' }; // Case-insensitive search
    if (propertyType) query.propertyType = propertyType;
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }

    const properties = await Property.find(query);
    res.json(properties);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getPropertyById = async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);
    if (!property || property.status !== "approved") {
      return res.status(404).json({ message: "Property not found" });
    }
    res.json(property);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const requestPropertyUpdate = async (req, res) => {
  try {
    const image = req.file?.filename || null;
    const { 
      originalPropertyId, 
      title, 
      description, 
      contactName, 
      contactNumber, 
      propertyType,
      district,
      price
    } = req.body;
    
    const newRequest = new Property({
      title,
      description,
      contactName,
      contactNumber,
      propertyType,
      district,
      price,
      image,
      status: "pending",
      requestType: "update",
      originalPropertyId,
    });
    await newRequest.save();
    res.status(200).json({ message: "Update request submitted." });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getPendingRequests = async (req, res) => {
  try {
    const pending = await Property.find({ status: "pending" });
    res.json(pending);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const rejectPropertyRequest = async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);
    if (!property) return res.status(404).json({ message: "Request not found." });

    if (property.requestType === "delete") {
      // Restore original status if delete request is rejected
      property.status = "approved";
      property.requestType = "add";
      await property.save();
      return res.json({ message: "Delete request rejected. Property restored." });
    }

    // For update or add requests: remove the request
    await Property.findByIdAndDelete(req.params.id);
    res.json({ message: "Request rejected and deleted." });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const requestPropertyDelete = async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);
    if (!property) return res.status(404).json({ message: "Property not found" });

    property.status = "pending";
    property.requestType = "delete";
    await property.save();

    res.json({ message: "Delete request submitted for approval." });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};