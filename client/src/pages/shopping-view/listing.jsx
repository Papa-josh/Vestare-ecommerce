// client/src/pages/shopping- view/listing.jsx

import ProductFilter from "@/components/shopping-view/filter";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { sortOptions } from "@/config";
import { ArrowUpDownIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchAllFilteredProducts,
  fetchProductDetails,
} from "@/store/shop/products-slice";
import ShoppingProductTile from "@/components/shopping-view/product-tile";
import ProductDetailsDialog from "../../components/shopping-view/product-details";
import { addToCart, fetchCartItems } from "@/store/shop/cart-slice";
import { useSearchParams } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

function ShoppingListing() {
  const dispatch = useDispatch();
  const { productList, productDetails } = useSelector(
    (state) => state.shopProducts
  );
  const { cartItems } = useSelector((state) => state.shopCart);
  const { user } = useSelector((state) => state.auth);
  const [filters, setFilters] = useState({});
  const [sort, setSort] = useState(null);
  const [searchParams, setSearchParams] = useSearchParams();
  const [openDetailsDialog, setOpenDetailsDialog] = useState(false);
  const { toast } = useToast();

  console.log(productList, "product list");

  //
  // eto yung makikita sa karugtong ng url
  // ex. http://localhost:5173/shop/listing?category=women&brand=nike
  // function to create search params
  function createSearchParamsHelper(filterParams) {
    const queryParams = [];

    // loop through the filter params
    for (const [key, value] of Object.entries(filterParams)) {
      if (Array.isArray(value) && value.length > 0) {
        const paramValue = value.join(",");

        queryParams.push(`${key}=${encodeURIComponent(paramValue)}`);
      }
    }

    // console.log(queryParams, "queryParams");

    return queryParams.join("&");
  }

  // getting the category search param from the url
  const categorySearchParam = searchParams.get("category");

  function handleSort(value) {
    // console.log(value, "value");
    setSort(value);
  }

  function handleFilter(getSectionId, getCurrentOption) {
    //                Section     //Option
    // console.log(getSectionId, getCurrentOption, "Category/Brand");

    // creating a copy of the filtered items
    let cpyFilters = { ...filters };

    //checking if SectionId is present or not in the filters
    const indexOfCurrentSection = Object.keys(cpyFilters).indexOf(getSectionId); // this will return -1, meaning that section is not currently being filtered. return 0 if present

    if (indexOfCurrentSection === -1) {
      cpyFilters = {
        ...cpyFilters,
        [getSectionId]: [getCurrentOption],
      };
    } else {
      //checking if Option is present or not in the filters
      const indexOfCurrentOption =
        cpyFilters[getSectionId].indexOf(getCurrentOption);

      if (indexOfCurrentOption === -1)
        //if option From cpyFilters is not present, push the getCurrentOption to cpyFilters
        cpyFilters[getSectionId].push(getCurrentOption);
      //if option From cpyFilters is present, remove it from cpyFilters
      else cpyFilters[getSectionId].splice(indexOfCurrentOption, 1);
    }
    // console.log(cpyFilters, "cpyFilters");

    //updating the filters state
    setFilters(cpyFilters);

    // storing the filters in the local storage
    sessionStorage.setItem("filters", JSON.stringify(cpyFilters));
  }

  function handleGetProductDetails(getCurrentProductId) {
    // console.log(getCurrentProductId, "productId");
    dispatch(fetchProductDetails(getCurrentProductId));
  }

  function handleAddtoCart(getCurrentProductId, getTotalStock) {
    // console.log(getCurrentProductId, "handle Addto cart");
    // console.log(cartItems, "cart Items");

    let getCartItems = cartItems.items || [];

    if (getCartItems.length) {
      const indexOfCurrentItem = getCartItems.findIndex(
        (item) => item.productId === getCurrentProductId
      );
      if (indexOfCurrentItem > -1) {
        const getQuantity = getCartItems[indexOfCurrentItem]?.quantity;
        if(getQuantity + 1 > getTotalStock){
          toast({
            title: `Only ${getQuantity} quantity can be added for this item`,
            variant: "destructive",
          });
          return;
        
      }
    }
  }
    // here we are adding the product to the cart
    dispatch(
      addToCart({
        userId: user?.id,
        productId: getCurrentProductId,
        quantity: 1,
      })
    )
      .then((data) => {
        // console.log(data, "data");
        if (data?.payload?.success)
          //fetching the cart items
          dispatch(fetchCartItems(user?.id));
        toast({
          title: "Product is added to the cart",
        });
      })
      .catch((err) => {
        console.log(err, "err");
      });
  }

  // retain the filters when the component re-renders or refresh the page
  useEffect(() => {
    //default sorting
    setSort("price-lowtohigh");

    //   getting the filters from the local storage
    setFilters(JSON.parse(sessionStorage.getItem("filters")) || {});
  }, [categorySearchParam]);

  // update the url when the filters change
  useEffect(() => {
    if (filters && Object.keys(filters).length > 0) {
      const createQueryString = createSearchParamsHelper(filters);
      setSearchParams(new URLSearchParams(createQueryString));
    }
  }, [filters]);

  //fetching all the products
  useEffect(() => {
    if (filters !== null && sort !== null)
      dispatch(
        fetchAllFilteredProducts({ filterParams: filters, sortParams: sort })
      );
  }, [dispatch, sort, filters]);

  //fetching the product details
  useEffect(() => {
    if (productDetails !== null) setOpenDetailsDialog(true);
  }, [productDetails]);

  // console.log(productList, "productList");
  // console.log(filters, searchParams, "filtersssss");
  // console.log(productDetails, "product Details");
  console.log(cartItems, "CartItems");

  return (
    <div className="grid grid-cols-1 md:grid-cols-[200px_1fr] gap-6 p-4 md:p-6">
      <ProductFilter filters={filters} handleFilter={handleFilter} />
      <div className="bg-background w-full rounded-lg shadow-sm">
        <div className="p-3 border-b flex items-center justify-between">
          <h2 className="text-lg font-extrabold">All Products</h2>
          <div className="flex items-center gap-3">
            <span className="text-muted-foreground">{productList?.length}</span>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-1"
                >
                  <ArrowUpDownIcon className="h-4 w-4" />
                  <span>Sort by</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-[200px]">
                <DropdownMenuRadioGroup value={sort} onValueChange={handleSort}>
                  {sortOptions.map((sortItem) => (
                    <DropdownMenuRadioItem
                      value={sortItem.id}
                      key={sortItem.id}
                    >
                      {sortItem.label}
                    </DropdownMenuRadioItem>
                  ))}
                </DropdownMenuRadioGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4">
          {productList && productList.length > 0
            ? productList.map((productItem) => (
                <ShoppingProductTile
                  handleGetProductDetails={handleGetProductDetails}
                  key={productItem._id}
                  product={productItem}
                  handleAddtoCart={handleAddtoCart}
                />
              ))
            : null}
        </div>
      </div>
      <ProductDetailsDialog
        open={openDetailsDialog}
        setOpen={setOpenDetailsDialog}
        productDetails={productDetails}
      />
    </div>
  );
}

export default ShoppingListing;
