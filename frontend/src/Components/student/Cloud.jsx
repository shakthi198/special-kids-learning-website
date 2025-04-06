let lastScrollTop = 0;

window.addEventListener("scroll", function () {
  const scrollPosition = window.scrollY;
  const delta = scrollPosition - lastScrollTop;

  // Reset clouds to original position when at the top
  if (scrollPosition === 0) {
    document.getElementById("c1").style.transform = `translate(500px, 150px)`;
    document.getElementById("c2").style.transform = `translate(-800px, 285px)`;
    document.getElementById("c3").style.transform = `translate(-35px, 220px)`;
    document.getElementById("c4").style.transform = `translate(460px, 280px)`;
    document.getElementById("c5").style.transform = `translate(700px, 160px)`;
    document.getElementById("c6").style.transform = `translate(-240px, 70px)`;
    document.getElementById("c7").style.transform = `translate(300px, 90px)`;
  }
  // Move clouds to the right when scrolling down
  else if (delta > 0) {
    document.getElementById("c1").style.transform = `translate(${
      scrollPosition * 0.1
    }px, 150px)`;
    document.getElementById("c2").style.transform = `translate(${
      scrollPosition * 0.1 + 5
    }px, 285px)`;
    document.getElementById("c3").style.transform = `translate(${
      scrollPosition * 0.1 + 450
    }px, 220px)`;
    document.getElementById("c4").style.transform = `translate(${
      scrollPosition * 0.1 + 350
    }px, 280px)`;
    document.getElementById("c5").style.transform = `translate(${
      scrollPosition * 0.1 + 150
    }px, 160x)`;
    document.getElementById("c6").style.transform = `translate(${
      scrollPosition * 0.1 - 50
    }px, 70px)`;
    document.getElementById("c7").style.transform = `translate(${
      scrollPosition * 0.1 - 150
    }px, 90px)`;
  }
  // Move clouds to the left when scrolling up
  else {
    document.getElementById("c1").style.transform = `translate(${
      scrollPosition * 0.1
    }px, 150px)`;
    document.getElementById("c2").style.transform = `translate(${
      scrollPosition * 0.1 - 10
    }px, 285px)`;
    document.getElementById("c3").style.transform = `translate(${
      scrollPosition * 0.1 - 250
    }px, 220px)`;
    document.getElementById("c4").style.transform = `translate(${
      scrollPosition * 0.1 - 250
    }px, 280px)`;
    document.getElementById("c5").style.transform = `translate(${
      scrollPosition * 0.1 + 450
    }px, 1600px)`;
    document.getElementById("c6").style.transform = `translate(${
      scrollPosition * 0.1 + 650
    }px, 70px)`;
    document.getElementById("c7").style.transform = `translate(${
      scrollPosition * 0.1 + 50
    }px, 90px)`;
  }

  lastScrollTop = scrollPosition <= 0 ? 0 : scrollPosition; // For Mobile or negative scrolling
});
