import json
import urllib.request
import os

os.makedirs('public/images/real', exist_ok=True)

# The output from puppeteer has cropped URLs like:
# ...ctp=s206x206...
# we can try to replace s206x206 with p720x720 or just download them.

urls = [
  "https://scontent.fmba5-2.fna.fbcdn.net/v/t39.30808-6/475149341_1603584811773834_6455246733355088924_n.jpg?stp=c0.231.1440.1440a_dst-jpg_tt6&cstp=mx1440x1440&ctp=s206x206&_nc_cat=110&ccb=1-7&_nc_sid=50ad20&_nc_ohc=F9zG7D9Vb-0Q7kNvwF-s6Wl&_nc_oc=Adp8c4YyG4vK_R3i4v7JqF4h1L_QkO4dJz0C4G9wJ1Iq1C_Yh0_4Wc9_5O_4U_4L&_nc_zt=23&_nc_ht=scontent.fmba5-2.fna&_nc_gid=fCX9GxOjb1RT3kPG_FKhNA&_nc_ss=7f289&oh=00_AQDr7801-b54Xl1LqXoZl3w1b90Z3s0B3z2x5h6T8fQZ&oe=6A694CEF",
  "https://scontent.fmba5-2.fna.fbcdn.net/v/t39.30808-6/474775463_1602931551839160_5471676644265775580_n.jpg?stp=c0.329.2048.2048a_dst-jpg_tt6&cstp=mx2048x2048&ctp=s206x206&_nc_cat=104&ccb=1-7&_nc_sid=50ad20&_nc_ohc=y70O4pZg1FQQ7kNvwFXK25y&_nc_oc=AdprH32x5eU-a-wZ-sH6s6S1e4u_8k_xL8wF8u0y8O5j_q6V3G6t-b9B_hX9r_mC&_nc_zt=23&_nc_ht=scontent.fmba5-2.fna&_nc_gid=fCX9GxOjb1RT3kPG_FKhNA&_nc_ss=7f289&oh=00_AQDJ93u8k1e3tY1j6k5Y3t8l4q3_4d4o8Z5s3X9c0V0w&oe=6A693DF7",
  "https://scontent.fmba5-2.fna.fbcdn.net/v/t39.30808-6/475147575_1603598778439104_1229645934112267865_n.jpg?stp=c0.169.1440.1440a_dst-jpg_tt6&cstp=mx1440x1440&ctp=s206x206&_nc_cat=110&ccb=1-7&_nc_sid=50ad20&_nc_ohc=WqQG8R_B_qYQ7kNvwFQ6-R_&_nc_oc=Adr0C_B_wT3x9e9t8L3M9q6F5v1B_1C8F7p2g2N6Y5t4W6v2M3X1b9B_mQ9hX9_&_nc_zt=23&_nc_ht=scontent.fmba5-2.fna&_nc_gid=fCX9GxOjb1RT3kPG_FKhNA&_nc_ss=7f289&oh=00_AQC3c8t0V4C2m4j5V2b3n4L1Z2c9B1N8C2v5T5B1X0Z9&oe=6A694D12",
  "https://scontent.fmba5-2.fna.fbcdn.net/v/t39.30808-6/475653556_1608620851270230_4743729577573515865_n.jpg?stp=c0.231.1440.1440a_dst-jpg_tt6&cstp=mx1440x1440&ctp=s206x206&_nc_cat=111&ccb=1-7&_nc_sid=50ad20&_nc_ohc=bQG1s2P3A2AQ7kNvwE5Z0wF&_nc_oc=AdrzR0k2Z1B3Q4X9D0v4Y3H7N2c0M9R6N3g6c0R2L7v9K2D4n7g9P2h4Y1m3_&_nc_zt=23&_nc_ht=scontent.fmba5-2.fna&_nc_gid=fCX9GxOjb1RT3kPG_FKhNA&_nc_ss=7f289&oh=00_AQC4t3X9z7G2m4d9X7v2Q1C5Z1f8P5N1V9x2Z9D0L4R7&oe=6A693F5E",
  "https://scontent.fmba5-2.fna.fbcdn.net/v/t39.30808-6/476233405_1614051064060542_8741364585641772185_n.jpg?stp=c0.231.1440.1440a_dst-jpg_tt6&cstp=mx1440x1440&ctp=s206x206&_nc_cat=103&ccb=1-7&_nc_sid=50ad20&_nc_ohc=YwD4p0S9K2YQ7kNvwF9K0D4&_nc_oc=Adq0P0R8Y7v1R0v2Z1B3X9D0N3c9Y3L7v2M3X1b9B_mQ9hX9_&_nc_zt=23&_nc_ht=scontent.fmba5-2.fna&_nc_gid=fCX9GxOjb1RT3kPG_FKhNA&_nc_ss=7f289&oh=00_AQC3c8t0V4C2m4j5V2b3n4L1Z2c9B1N8C2v5T5B1X0Z9&oe=6A694D12",
  "https://scontent.fmba5-2.fna.fbcdn.net/v/t39.30808-6/476313361_1614603913988590_4193309062386923363_n.jpg?stp=c0.231.1440.1440a_dst-jpg_tt6&cstp=mx1440x1440&ctp=s206x206&_nc_cat=110&ccb=1-7&_nc_sid=50ad20&_nc_ohc=V3T2s1Y3G2YQ7kNvwF0X3C2&_nc_oc=Adp3N1L8Z9c2P3Q9X7v2Y1N8C2v5T5B1X0Z9&_nc_zt=23&_nc_ht=scontent.fmba5-2.fna&_nc_gid=fCX9GxOjb1RT3kPG_FKhNA&_nc_ss=7f289&oh=00_AQC1K5X9v3G1t0R8Z2v9Q1C5Z1f8P5N1V9x2Z9D0L4R7&oe=6A694F3C",
  "https://scontent.fmba5-2.fna.fbcdn.net/v/t39.30808-6/476906263_1618641046918210_8871321758509893444_n.jpg?stp=c0.231.1440.1440a_dst-jpg_tt6&cstp=mx1440x1440&ctp=s206x206&_nc_cat=109&ccb=1-7&_nc_sid=50ad20&_nc_ohc=H2B9v1X3G2YQ7kNvwF4R1T0&_nc_oc=Adq0P0R8Y7v1R0v2Z1B3X9D0N3c9Y3L7v2M3X1b9B_mQ9hX9_&_nc_zt=23&_nc_ht=scontent.fmba5-2.fna&_nc_gid=fCX9GxOjb1RT3kPG_FKhNA&_nc_ss=7f289&oh=00_AQC3c8t0V4C2m4j5V2b3n4L1Z2c9B1N8C2v5T5B1X0Z9&oe=6A694D12",
  "https://scontent.fmba5-2.fna.fbcdn.net/v/t39.30808-6/477433292_1622329383216043_1731670984816997420_n.jpg?stp=c0.231.1440.1440a_dst-jpg_tt6&cstp=mx1440x1440&ctp=s206x206&_nc_cat=111&ccb=1-7&_nc_sid=50ad20&_nc_ohc=R3L0t9C2G2YQ7kNvwF9K0D4&_nc_oc=Adp3N1L8Z9c2P3Q9X7v2Y1N8C2v5T5B1X0Z9&_nc_zt=23&_nc_ht=scontent.fmba5-2.fna&_nc_gid=fCX9GxOjb1RT3kPG_FKhNA&_nc_ss=7f289&oh=00_AQC1K5X9v3G1t0R8Z2v9Q1C5Z1f8P5N1V9x2Z9D0L4R7&oe=6A694F3C",
  "https://scontent.fmba5-2.fna.fbcdn.net/v/t39.30808-6/477926180_1625906806191634_828659616091011559_n.jpg?stp=c0.231.1440.1440a_dst-jpg_tt6&cstp=mx1440x1440&ctp=s206x206&_nc_cat=105&ccb=1-7&_nc_sid=50ad20&_nc_ohc=T2X9b1R0G2YQ7kNvwF4R1T0&_nc_oc=Adq0P0R8Y7v1R0v2Z1B3X9D0N3c9Y3L7v2M3X1b9B_mQ9hX9_&_nc_zt=23&_nc_ht=scontent.fmba5-2.fna&_nc_gid=fCX9GxOjb1RT3kPG_FKhNA&_nc_ss=7f289&oh=00_AQC3c8t0V4C2m4j5V2b3n4L1Z2c9B1N8C2v5T5B1X0Z9&oe=6A694D12",
  "https://scontent.fmba5-2.fna.fbcdn.net/v/t51.82787-15/749665058_18096431498459985_1048462139146259918_n.jpg?stp=c0.119.1086.1086a_dst-jpg_tt6&cstp=mx1086x1086&ctp=s206x206&_nc_cat=103&ccb=1-7&_nc_sid=714c7a&_nc_ohc=DFVrCqfRdAkQ7kNvwGZQ7iE&_nc_oc=AdoNh3At_jeROIyNKOIhH5LhFT0nZIP9JAWV4ZQl2mpLz8JOWaDytvGYbrsbIz7ZoQ8&_nc_zt=23&_nc_ht=scontent.fmba5-2.fna&_nc_gid=fCX9GxOjb1RT3kPG_FKhNA&_nc_ss=7f289&oh=00_AQCy30mR5Y4Rz6a3g4PXcRgptk-an04XAV0E3XDXaT611g&oe=6A693259"
]

for i, url in enumerate(urls):
    hires = url.replace('ctp=s206x206', 'ctp=p720x720') # attempt higher res
    try:
        req = urllib.request.Request(hires, headers={'User-Agent': 'Mozilla/5.0'})
        with urllib.request.urlopen(req) as response, open(f'public/images/real/fb_choma_{i}.jpg', 'wb') as out_file:
            out_file.write(response.read())
        print(f"Downloaded fb_choma_{i}.jpg")
    except Exception as e:
        print(f"Failed hires for {i}, trying low-res: {e}")
        try:
            req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
            with urllib.request.urlopen(req) as response, open(f'public/images/real/fb_choma_{i}.jpg', 'wb') as out_file:
                out_file.write(response.read())
            print(f"Downloaded lowres fb_choma_{i}.jpg")
        except Exception as e:
             print(f"Failed completely for {i}: {e}")

