package petr26.cz.controllers;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

/**
 * @author pkoucky <petr.koucky.26@gmail.com>
 */
@Controller("/")
public class IndexController {

    @RequestMapping("")
    public String index() {
        return "index";
    }
}
