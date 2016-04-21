package petr26.cz.config;

import org.springframework.boot.autoconfigure.web.WebMvcAutoConfiguration;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;

/**
 * @author pkoucky <petr.koucky.26@gmail.com>
 */
@Configuration
public class WebConfig extends WebMvcAutoConfiguration.WebMvcAutoConfigurationAdapter {

//    private static final Logger LOGGER = Logger.getLogger(WebConfig.class);

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        registry.addResourceHandler("/css/**",
                        "/js/**",
                        "/backend/**")
                .addResourceLocations("classpath:/templates/css/",
                        "classpath:/templates/js/",
                        "classpath:/templates/backend/");
    }
}
