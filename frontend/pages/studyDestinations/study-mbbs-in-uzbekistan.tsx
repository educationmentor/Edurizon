import Breadcrumbs from "@/components/Breadcumbs";
import RelatedCountries from "@/components/studyDestinationComponents/relatedCountries";
import Image from "next/image";
const NewPage=()=>{
    return(
        <div>
             <section className="country-inner-banner">
                <div className="container pt-[4vw]">
                    <div className="flex flex-row align-items-center ">
                    <div className="col-xl-10 col-lg-10 col-md-10 col-sm-9 col-9 ">
                        <div className="heading">
                        <h2 className=" text-h5TextPhone md:text-h5Text">Study in Uzbekistan</h2>
                        </div>
                        <Breadcrumbs/>
                    </div>
                    <div className="col-xl-2 col-lg-2 col-md-2 col-sm-3 col-3 text-end ml-auto">
                        <Image alt="banglades flag" width={100} height={100} src="/assets/Images/country-flag/uzbekistan.png" className="img-fluid" />
                    </div>
                    </div>
                </div>
            </section>
            <section className="inner-page-bg">
  <div className="container">
    <div className="row g-0">
      <div className="immigrate-bg">
        <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12 col-12">
                            <div className="flex justify-center items-center overflow-hidden  h-[37.25vw]">
                                            <Image alt="hi" src="/assets/Images/slider/uzbekistan-slider.jpeg"  className=" overflow-hidden contain object-cover h-full w-full" width={1000} height={1000} />
                                        </div>
                            </div>
        
        <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12 col-12">
          <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12 col-12">
            <div className="heading">
              <h3 className="pt-4 text-h5TextPhone md:text-h5Text">About Uzbekistan</h3>
            </div>
            <p>
              Uzbekistan is a Central Asian nation and former Soviet republic. It's known for its mosques, mausoleums and other sites linked to the Silk Road, the ancient trade route between China and the Mediterranean. Tashkent is the
              capital city of Uzbekistan. It’s known for its many museums and its mix of modern and Soviet-era architecture. The city’s skyline is distinguished by Tashkent Tower, which offers city views from its observation deck.
            </p>
            <p>Andijan is the administrative, economic, and cultural center of Andijan Region. It is located in the south-eastern edge of the Fergana Valley near Uzbekistan's border with Kyrgyzstan.</p>
            <p>
              Andijan is one of the oldest cities in the Fergana Valley. Historically, Andijan was an important city on the Silk Road. Andijan was developed into an important industrial city during the Soviet era. Manufactured goods are
              produced in the city include chemicals, domestic appliances, electronics, foodstuffs, furniture, plows, pumps, shoes, spare parts for farming machines, various engineering tools and wheelchairs.
            </p>
          </div>
          <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12 col-12">
            <div className="heading">
              <h3 className="pt-4 text-h5TextPhone md:text-h5Text">Geography & Demographics</h3>
            </div>
            <p>
              Andijan is located around 450 metres above sea level in the south-eastern edge of the Fergana Valley near Uzbekistan's border with Kyrgyzstan. In the year 2022, Andijan had a population of around 458,500. Representatives of
              many ethnic groups can be found in the city. Uzbeks are the largest ethnic group, followed by Tajiks.
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</section>
<section className="inner-page-bg">
  <div className="container">
    <div className="row g-0">
      <div className="immigrate-bg">
        <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12 col-12">
          <div className="heading">
            <h3 className="text-h5TextPhone md:text-h5Text">Food</h3>
          </div>
          <p>
            Andijan is also known with fascinating dishes, one of the most popular food is Plov also known Osh in the local language. Nevertheless, there are some other delicious foods as well such as Somsa, Monti and Dolma in the local
            language. However, Andijan is also known for its dance called Andijan polka and it has been reported that this dance history goes all the way back to the old centuries.
          </p>
        </div>

        <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12 col-12">
          <div className="heading">
            <h3 className="pt-4 text-h5TextPhone md:text-h5Text">Climate</h3>
          </div>
          <p>
            Andijan has a cold semi-arid climate with cold winters and hot summers, rendering a very continental nature, although winters are milder than one might expect for a location in Central Asia. Rainfall is generally light and
            erratic. Summers are particularly dry.
          </p>
        </div>
      </div>
    </div>
  </div>
</section>
<section className="inner-page-bg">
  <div className="container">
    <div className="row g-0">
      <div className="immigrate-bg">
        <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12 col-12">
          <div className="heading">
            <h3 className="text-h5TextPhone md:text-h5Text">Details of Universities</h3>
          </div>
          <div className="table-responsive">
            <table className="table table-bordered table-striped align-middle">
              <thead className="table-dark">
                <tr className="text-white">
                  <th scope="col">Sr. No.</th>
                  <th scope="col">Image</th>
                  <th scope="col">University Name</th>
                  <th scope="col">Tuition Fees (USD)</th> 
                  <th scope="col">More Information</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <th scope="row">1.</th>
                  <td>
                    <a href="https://edurizon.in/andijan-state-medical-institute.php">
                      <Image width={100} height={100} src="/assets/Images/mbbs-in-uzbekistan/university-logo/andijan-state-medical-institute-logo.jpeg" className="img-fluid univ-logo-size" alt="Andijan State Medical Institute" title="Andijan State Medical Institute" />
                    </a>
                  </td>
                  <td>
                    <b><a href="https://edurizon.in/andijan-state-medical-institute.php">Andijan State Medical Institute</a></b>
                  </td>
                  <td>3,400</td> 
                  <td><a href="https://edurizon.in/andijan-state-medical-institute.php" className="btn-custom btn-univ-detail">Read More</a></td>
                </tr>
                <tr>
                  <th scope="row">2.</th>
                  <td>
                    <a href="https://edurizon.in/samarkand-state-medical-university.php">
                      <Image width={100} height={100} src="/assets/Images/mbbs-in-uzbekistan/university-logo/samarkand-state-medical-university-logo.png" className="img-fluid univ-logo-size" alt="Samarkand State Medical University" title="Samarkand State Medical University" />
                    </a>
                  </td>
                  <td>
                    <b><a href="https://edurizon.in/samarkand-state-medical-university.php">Samarkand State Medical University</a></b>
                  </td>
                  <td>3,600</td> 
                  <td><a href="https://edurizon.in/samarkand-state-medical-university.php" className="btn-custom btn-univ-detail">Read More</a></td>
                </tr>
                <tr>
                  <th scope="row">3.</th>
                  <td>
                    <a href="https://edurizon.in/fergana-state-medical-university.php">
                      <Image width={100} height={100} src="/assets/Images/mbbs-in-uzbekistan/university-logo/fergana-state-medical-university-logo.jpeg" className="img-fluid univ-logo-size" alt="Fergana State Medical University" title="Fergana State Medical University" />
                    </a>
                  </td>
                  <td>
                    <b><a href="https://edurizon.in/fergana-state-medical-university.php">Fergana State Medical University</a></b>
                  </td>
                  <td>3,600</td> 
                  <td><a href="https://edurizon.in/fergana-state-medical-university.php" className="btn-custom btn-univ-detail">Read More</a></td>
                </tr>
                
                <tr>
                  <th scope="row">4.</th>
                  <td>
                    <a href="https://edurizon.in/tashkent-medical-academy.php">
                      <Image width={100} height={100} src="/assets/Images/mbbs-in-uzbekistan/university-logo/tashkent-medical-academy-logo.jpg" className="img-fluid univ-logo-size" alt="Fergana State Medical University" title="Fergana State Medical University" />
                    </a>
                  </td>
                  <td>
                    <b><a href="https://edurizon.in/tashkent-medical-academy.php">Tashkent Medical Academy</a></b>
                  </td>
                  <td>3,000</td> 
                  <td><a href="https://edurizon.in/tashkent-medical-academy.php" className="btn-custom btn-univ-detail">Read More</a></td>
                </tr>
                
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  </div>
</section> 
            <section className="inner-page-bg">
  <div className="container">
    <div className="row g-0">
      <div className="immigrate-bg">
        <RelatedCountries/>
      </div>
    </div>
  </div>
  

  <div className='h-[2vw]'>

</div>
</section>
        </div>
    )
}

export default NewPage;