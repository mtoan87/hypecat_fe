import { useState, useMemo } from "react";
import { Box, Grid, Card, CardMedia } from "@mui/material";
import type { ProductImage } from "../../types/ProductType";
import uuidv4 from "../../utils/uuidv4";

const ProductImageGallery = ({
  images,
  cover,
}: {
  images: ProductImage[];
  cover: string;
}) => {
  const galleryImages = useMemo(() => {
    if (!cover || !images?.length) return [];

    // Remove duplicate cover if it already exists in images
    const filtered = images.filter((img) => img.urlPath !== cover);

    return [
      {
        id: uuidv4(), // CALL the function
        urlPath: cover,
      },
      ...filtered,
    ];
  }, [cover, images]);

  const [selectedImage, setSelectedImage] = useState(
    galleryImages[0]?.urlPath || ""
  );

  return (
    <Box
      sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}
    >
      <Card sx={{ width: "50%", height: 200, mb: 2 }}>
        <CardMedia
          component="img"
          image={selectedImage}
          alt="Main product image"
          sx={{ objectFit: "contain", height: "100%" }}
        />
      </Card>

      {galleryImages.length > 1 && (
        <Box sx={{ display: "flex", justifyContent: "center" }}>
          <Grid container spacing={1} justifyContent="center">
            {galleryImages.map((img) => (
              <Grid key={img.id}>
                <Card
                  sx={{
                    width: 80,
                    height: 80,
                    border:
                      selectedImage === img.urlPath
                        ? "2px solid #1976d2"
                        : "1px solid #ccc",
                    cursor: "pointer",
                  }}
                  onClick={() => setSelectedImage(img.urlPath)}
                >
                  <CardMedia
                    component="img"
                    image={img.urlPath}
                    alt={`Thumbnail ${img.id}`}
                    sx={{ width: "100%", height: "100%", objectFit: "cover" }}
                  />
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>
      )}
    </Box>
  );
};

export default ProductImageGallery;
