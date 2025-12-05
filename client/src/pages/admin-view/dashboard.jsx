import React, { useEffect, useState } from "react";
import ProductImageUpload from "./image-upload";
import { Button } from "@/components/ui/button";
import { useDispatch, useSelector } from "react-redux";
import { addFeatureImage, getFeatureImages } from "@/store/common-slice";

function AdminDashboard() {
    const [imageFile, setImageFile] = useState(null);
    const [uploadedImageUrl, setUploadedImageUrl] = useState("");
    const [imageLoadingState, setImageLoadingState] = useState(false);
    const dispatch = useDispatch()
    const { featureImageList } = useSelector((state) => state.commonFeature);

  console.log(uploadedImageUrl, "Uploaded Image Url");

  function handleUploadFeatureImage(){
    dispatch(addFeatureImage(uploadedImageUrl)).then(data=> {
      //  console.log(data)
      if(data?.payload?.success){
    dispatch(getFeatureImages());     
    setImageFile(null)   
    setUploadedImageUrl('')
      }
    })
  }

  useEffect(()=> {
    dispatch(getFeatureImages())
  },[dispatch]);

  console.log(featureImageList, "feature image list");


  return (
    <div>
      <ProductImageUpload
        imageFile={imageFile}
        setImageFile={setImageFile}
        uploadedImageUrl={uploadedImageUrl}
        setUploadedImageUrl={setUploadedImageUrl}
        setImageLoadingState={setImageLoadingState}
        imageLoadingState={imageLoadingState}
        isCustomStyling={true}
        // isEditMode={currentEditedId !== null}
      />
      <Button onClick={handleUploadFeatureImage} className="mt-5 w-full">Upload</Button>
      <div className="flex flex-col gap-4 mt-5">
        {featureImageList && featureImageList.length > 0 ?
        featureImageList.map(featureImageItem=> (
            <div key={featureImageItem._id}>
          <img
            src={featureImageItem.image}
            className="w-full h-[300px] object-cover rounded-t-lg"
          />
        </div> 
        )) : null}
      </div>
    </div>
  );
}

export default AdminDashboard;


